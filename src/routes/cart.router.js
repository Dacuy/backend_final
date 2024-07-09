import { Router } from "express";
import { cartService, productService } from "../managers/index.js";
import mongoose from 'mongoose';

const router = Router();

router.post('/createCart', async (req, res) => {
    const { products = [] } = req.body;
    try {
        await cartService.createCart({ products });
        res.send(products.length ? 'Carrito ha sido creado con productos' : 'Carrito ha sido creado vacío');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:cid', async (req, res) => {
    const { cid: cartId } = req.params;
    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('ID de carrito no es válido');
    }
    try {
        const cartExistente = await cartService.getCart(cartId);
        if (cartExistente) {
            res.send(cartExistente)
        } else {
            res.status(404).send(`El carrito con id ${cartId} no existe`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid: cartId, pid: idProd } = req.params;
    if (!cartId || !idProd || !mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(idProd)) {
        return res.status(400).send('ID de carrito o producto no es válido');
    }
    try {
        const producto = await productService.getProduct({ _id: idProd });
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        const carrito = await cartService.getCart(cartId);
        if (!carrito) {
            return res.status(404).send('Carrito no encontrado');
        }

        const productoEnCarrito = carrito.products.find(prod => prod.id.equals(idProd));
        if (productoEnCarrito) {
            productoEnCarrito.quantity += 1;
            productoEnCarrito.title = producto.title; // Actualizamos el título del producto
            productoEnCarrito.price = producto.price; // Actualizamos el precio del producto
        } else {
            carrito.products.push({ id: idProd, quantity: 1, title: producto.title, price: producto.price });
        }
        await cartService.updateCart(cartId, carrito);
        res.status(200).send('Producto agregado al carrito exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid: cartId, pid: productId } = req.params;
    if (!cartId || !productId || !mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send('ID de carrito o producto no es válido');
    }
    try {
        const carrito = await cartService.getCart(cartId);
        if (!carrito) {
            return res.status(404).send('Carrito no encontrado');
        }

        carrito.products = carrito.products.filter(product => !product.id.equals(productId));
        await cartService.updateCart(cartId, carrito);
        res.send('Producto eliminado del carrito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:cid', async (req, res) => {
    const { cid: cartId } = req.params;
    const { products } = req.body;
    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('ID de carrito no es válido');
    }
    try {
        const carrito = await cartService.getCart(cartId);
        if (!carrito) {
            return res.status(404).send('Carrito no encontrado');
        }

        carrito.products = products;
        await cartService.updateCart(cartId, carrito);
        res.send('Carrito actualizado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid: cartId, pid: productId } = req.params;
    const { quantity } = req.body;
    if (!cartId || !productId || !mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send('ID de carrito o producto no es válido');
    }
    try {
        const carrito = await cartService.getCart(cartId);
        if (!carrito) {
            return res.status(404).send('Carrito no encontrado');
        }

        const productoEnCarrito = carrito.products.find(prod => prod.id.equals(productId));
        if (productoEnCarrito) {
            productoEnCarrito.quantity = quantity;
            await cartService.updateCart(cartId, carrito);
            res.send('Cantidad de producto actualizada con éxito');
        } else {
            res.status(404).send('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid: cartId } = req.params;
    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).send('ID de carrito no es válido');
    }
    try {
        const cartToDelete = await cartService.getCart(cartId);
        if (!cartToDelete) {
            return res.status(404).send('Carrito no encontrado');
        }
        await cartService.deleteCart(cartId);
        res.send('Carrito eliminado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;
