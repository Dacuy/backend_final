import productModel from "./models/products.model.js";

export default class ProductManager {
    createProduct(producto) {
        return productModel.create(producto);
    }

    getProduct(opts = {}) {
        return productModel.findOne(opts);
    }

    getProducts(query = {}, options = {}) {
        const { limit = 10, page = 1, sort = null } = options;
        const mongoOptions = {
            limit,
            skip: (page - 1) * limit,
            sort: sort ? { price: sort } : undefined
        };

        return productModel.find(query, null, mongoOptions);
    }

    updateProduct(productId, updateData) {
        return productModel.updateOne({ _id: productId }, { $set: updateData });
    }

    deleteProduct(productId) {
        return productModel.deleteOne({ _id: productId });
    }

    getEstimatedCount() {
        return productModel.estimatedDocumentCount();
    }
}