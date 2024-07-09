import { Router } from "express";
import { productService } from '../managers/index.js';

const router = Router();

router.post('/newProduct', async (req, res) => {
    const body = req.body;
    if (!body.title || !body.description || !body.price || !body.stock || !body.category) {
        return res.status(404).send('El producto que intenta añadir no tiene todos los campos necesarios completos');
    } else {
        const prodExists = await productService.getProduct({ title: body.title });
        if (!prodExists) {
            await productService.createProduct(body);
            res.send(`El producto ${body.title} ha sido agregado con éxito`);
        } else {
            res.send(`El producto con nombre ${body.title} ya existe`);
        }
    }
});

router.post('/updateProduct/:pid', async (req, res) => {
    const pid = req.params.pid;
    const body = req.body;
    const producto = await productService.getProduct({ _id: pid });
    if (!producto) {
        return res.status(404).send(`El producto con la ID N° ${pid} no existe intenta nuevamente más tarde o busca otro producto.`);
    } else {
        await productService.updateProduct(pid, body);
        res.send(`El producto con la ID N° ${pid} ha sido actualizado con éxito`);
    }
});

router.delete('/deleteProduct/:pid', async (req, res) => {
    const id = req.params.pid;
    if (id) {
        const productToDelete = await productService.getProduct({ _id: id });
        if (!productToDelete) {
            return res.status(404).send(`El producto con la ID N° ${id} no existe intenta nuevamente más tarde o busca otro producto.`);
        } else {
            try {
                await productService.deleteProduct(id);
                res.send(`El producto con la ID N° ${id} ha sido eliminado con éxito`);
            } catch (error) {
                res.status(403).send(`Error al borrar el producto ${error}`);
            }
        }
    }
});

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    if (pid) {
        const product = await productService.getProduct({ _id: pid });
        if (!product) {
            return res.status(404).send(`El producto con la ID N° ${pid} no existe intenta nuevamente más tarde o busca otro producto.`);
        } else {
            res.send(product);
        }
    } else {
        return res.status(404).send('No proporcionaste un ID');
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await productService.getProducts();
        res.send(result)
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;
