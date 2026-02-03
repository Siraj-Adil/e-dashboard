import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Schema
const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    createdAt: { type: Date, default: Date.now },
    deviceInfo: { type: String }, // optional: user agent / IP
}).index(
    { createdAt: 1 },
    {
        expireAfterSeconds:
            process.env.NODE_ENV === 'production'
                ? 7 * 24 * 60 * 60 + (10 * 60 * 2) / 3
                : 45 + (15 * 2) / 3,
    }
); // The time after which we want to delete the refreshToken
// from MongoDB automatically even though user closes the tab without hitting the logout button
// Should be more than (refreshToken lifetime) + (interval after which we are refreshing)

// Model (modelName, schema, collectionName)
const refreshTokensModel = mongoose.model(
    'refreshTokens',
    refreshTokenSchema,
    'refreshTokens'
);
export default refreshTokensModel;
