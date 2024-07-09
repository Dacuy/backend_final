// models/products.model.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    stock:Number,
    category:String
});

export default mongoose.model('products', productSchema);



