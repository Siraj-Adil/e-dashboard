import mongoose from 'mongoose';

// Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String,
    category: String,
    user_id: String,
});

// Model (modelName, schema, collectionName)
const productsModel = mongoose.model('products', productSchema, 'products');
export default productsModel;
