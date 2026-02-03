import mongoose from 'mongoose';

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// Model (modelName, schema, collectionName)
const usersModel = mongoose.model('users', userSchema, 'users');
export default usersModel;
