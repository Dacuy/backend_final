import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import { engine } from 'express-handlebars';
import showProducts from './routes/viewsRouter.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { productService } from './managers/index.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect('mongodb+srv://dac_:84wLhIVrybS7jv3Z@coderclusterentregafina.wbxsimk.mongodb.net/items?retryWrites=true&w=majority&appName=CoderClusterEntregaFinal')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

const server = app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`));
const socketServer = new Server(server);

socketServer.on('connection', async (socketClient) => {
    try {
        const productos = await productService.getProducts();
        console.log('Cliente conectado');
        socketServer.emit('productos', productos);

        socketClient.on('deleteProduct', async (data) => {
            try {
                const productoaBorrar = await productService.getProduct({ _id: data });
                if (productoaBorrar) {
                    await productService.deleteProduct({ _id: data });
                    const productosActualizados = await productService.getProducts();
                    socketServer.emit('productos', productosActualizados);
                } else {
                    console.error(`Producto con id ${data} no encontrado`);
                }
            } catch (error) {
                console.error(`Error al eliminar el producto con id ${data}:`, error);
            }
        });

        socketClient.on('addProduct', async (data) => {
            try {
                if (data.title && data.description && data.price && data.stock && data.category) {
                    await productService.createProduct(data);
                    const productosActualizados = await productService.getProducts();
                    socketServer.emit('productos', productosActualizados);
                } else {
                    console.error('Datos del producto incompletos:', data);
                }
            } catch (error) {
                console.error('Error al agregar el producto:', error);
            }
        });

    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
});

app.use(express.json());
app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main'
}));
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
});

app.use(express.static('./src/public'));
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/', showProducts);