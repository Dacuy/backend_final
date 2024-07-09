import { Router } from "express";
import { productService, cartService } from "../managers/index.js";
const router = Router();
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';

router.get('/productos', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
        const query = req.query.query ? { category: req.query.query } : {};

        const options = { limit, page, sort };

        const products = await productService.getProducts(query, options);
        const totalProducts = await productService.getEstimatedCount();
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        res.render('index', {
            productos: products,
            css: 'index',
            totalProducts,
            totalPages,
            currentPage: page,
            productsPerPage: limit,
            hasPrevPage,
            hasNextPage,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/productos/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productService.getProduct({ _id: productId });

        if (product) {
            res.render('productDetail', {
                producto: product,
                css: 'productDetail'
            });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const carrito = await cartService.getCart(cartId);
    res.render('cartDetail', {
        productos: carrito.products,
        idCart: cartId
    });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTime');
});

export default router;