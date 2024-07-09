import mongoose from 'mongoose';
import cartModel from "./models/carts.model.js";

export default class CartManager {
    createCart(cart) {
        return cartModel.create(cart);
    }

    getCart(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Invalid ObjectId');
        }
        return cartModel.findOne({ _id: new mongoose.Types.ObjectId(cartId) });
    }

    getCarts(opts = {}) {
        return cartModel.find(opts);
    }

    getCartWithProducts(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Invalid ObjectId');
        }
        return cartModel.findById(new mongoose.Types.ObjectId(cartId)).populate('products.id').exec();
    }

    updateCart(cartId, updateData) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Invalid ObjectId');
        }
        return cartModel.updateOne({ _id: new mongoose.Types.ObjectId(cartId) }, { $set: updateData });
    }

    deleteCart(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('Invalid ObjectId');
        }
        return cartModel.deleteOne({ _id: new mongoose.Types.ObjectId(cartId) });
    }
}
