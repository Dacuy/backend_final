import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
        },
    ],
});

const cartModel = mongoose.model('Cart', cartSchema);

export default cartModel;
