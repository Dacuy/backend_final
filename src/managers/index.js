import productManager from "./mongo/productsManager.js";
import CartManager from './mongo/cartManager.js'



export const cartService = new CartManager();
export const productService = new productManager();