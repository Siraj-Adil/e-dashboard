import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/mongoDBConfig.js';
import usersModel from './db/users.js';
import productsModel from './db/products.js';
import refreshTokensModel from './db/refreshTokens.js';
dotenv.config();

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_URI, // your frontend
        credentials: true, // allow cookies
    })
);
app.use(express.json());
app.use(cookieParser());
connectDB();

function validateRequired(required, body) {
    const missing = required.filter((key) => !body[key]);

    let returnStr = '';
    for (let i = 0; i < missing.length; i++) {
        if (i > 0 && i < missing.length - 1) {
            returnStr += ', ';
        } else if (i > 0 && i == missing.length - 1) {
            returnStr += ' and ';
        }
        returnStr += missing[i];
    }
    returnStr += ' cannot be empty.';
    return returnStr;
}

// Get All products database
app.get('/', async (req, resp) => {
    try {
        const results = await productsModel.find();
        return resp.json(results);
    } catch (err) {
        console.log(err);
        return resp.status(500).json({ error: 'Database query failed' });
    }
});

// SignUp
app.post('/registerUser', async (req, resp) => {
    try {
        const body = req.body;

        if (body.name && body.email && body.password) {
            // Checking if user already exist
            const get_user = await usersModel.find({ email: body.email });

            if (get_user.length == 0) {
                // Creating user
                const hashedPassword = await bcrypt.hash(body.password, 10);
                const newUserModelObj = new usersModel({
                    name: body.name,
                    email: body.email,
                    password: hashedPassword,
                });
                const result = await newUserModelObj.save();

                // Getting (and returning) created user object if user saving is successful
                if (result && result._id) {
                    const user_Obj = {
                        user_id: result._id,
                        name: result.name,
                        email: result.email,
                    };
                    // Creating JWT Access Token and Refresh Token and sending it back along with found user
                    const accessToken = jwt.sign(
                        user_Obj,
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn:
                                process.env.NODE_ENV === 'production'
                                    ? '10m'
                                    : '15s',
                        }
                    );
                    const refreshToken = jwt.sign(
                        user_Obj,
                        process.env.REFRESH_TOKEN_SECRET,
                        {
                            expiresIn:
                                process.env.NODE_ENV === 'production'
                                    ? '7d'
                                    : '45s',
                        }
                    );
                    // Save refresh token in DB
                    const newRefreshTokenModelObj = new refreshTokensModel({
                        token: refreshToken,
                        userId: user_Obj.user_id,
                        deviceInfo: req.headers['user-agent'],
                    });
                    const refreshTokenResult =
                        await newRefreshTokenModelObj.save();
                    // If token saving is successful
                    if (refreshTokenResult && refreshTokenResult._id) {
                        // ⬇⬇ STORE REFRESH TOKEN IN HTTPONLY COOKIE ⬇⬇
                        resp.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production', // HTTPS (true) in production
                            sameSite:
                                process.env.NODE_ENV === 'production'
                                    ? 'none'
                                    : 'strict',
                            maxAge:
                                process.env.NODE_ENV === 'production'
                                    ? (7 * 24 * 60 * 60 + (10 * 60 * 2) / 3) *
                                      1000
                                    : (45 + (15 * 2) / 3) * 1000, // Same as refreshToken deletion time from DB
                            path: '/', // It is telling the browser:
                            // “Hey browser, here is a cookie — but ONLY send it back to me when the request path is EXACTLY "/" ie all routes.
                            // Earlier, I have set its value to '/refresh-token' because at that time I wanted cookie to be sent from browser
                            // in this '/refresh-token' route only. But later I realized I need it in '/logout' also. So I changed its value
                            // to '/' ie all routes where we need the cookie in that route or not.
                        });
                        console.log('SIGNUP AT', new Date().toTimeString());
                        // 201 Created : Resource (user) was successfully created.
                        return resp.status(201).json({
                            success: true,
                            user: user_Obj,
                            auth: accessToken,
                            error: null,
                        });
                    } else {
                        // 500 Internal Server Error : Unexpected backend issue.
                        return resp.status(500).json({
                            success: false,
                            user: null,
                            auth: null,
                            error: 'Unexpected error while storing refreshToken',
                        });
                    }
                } else {
                    // 500 Internal Server Error : Unexpected backend issue.
                    return resp.status(500).json({
                        success: false,
                        user: null,
                        auth: null,
                        error: 'Unexpected error while storing user',
                    });
                }
            } else {
                // 409 Conflict : Request conflicts with existing resource (user).
                return resp.status(409).json({
                    success: false,
                    user: null,
                    auth: null,
                    error: 'User already exist with same email id, kindly login to proceed',
                });
            }
        } else {
            // 400 Bad Request : Bad request from client side.
            return resp.status(400).json({
                success: false,
                user: null,
                auth: null,
                error: validateRequired(['name', 'email', 'password'], body),
            });
        }
    } catch (err) {
        console.log(err);
        // 500 Internal Server Error : Unexpected backend issue.
        return resp.status(500).json({
            success: false,
            user: null,
            auth: null,
            error: 'Signup failed due to server error',
        });
    }
});

// LogIn
app.post('/getUser', async (req, resp) => {
    try {
        const body = req.body;
        if (body.email && body.password) {
            // Checking if user exist
            const results = await usersModel.find({ email: body.email });

            // Comparing the password of found user (1st arguement = user_entered_password, 2nd arguement = database stored password)
            if (results.length == 1) {
                const isPasswordMatches = await bcrypt.compare(
                    body.password,
                    results[0].password
                );
                // Returning the user if password matches
                if (isPasswordMatches) {
                    const user_Obj = {
                        user_id: results[0]._id,
                        name: results[0].name,
                        email: results[0].email,
                    };
                    // Creating JWT Access Token and Refresh Token and sending it back along with found user
                    const accessToken = jwt.sign(
                        user_Obj,
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn:
                                process.env.NODE_ENV === 'production'
                                    ? '10m'
                                    : '15s',
                        }
                    );
                    const refreshToken = jwt.sign(
                        user_Obj,
                        process.env.REFRESH_TOKEN_SECRET,
                        {
                            expiresIn:
                                process.env.NODE_ENV === 'production'
                                    ? '7d'
                                    : '45s',
                        }
                    );
                    // Save refresh token in DB
                    const newRefreshTokenModelObj = new refreshTokensModel({
                        token: refreshToken,
                        userId: user_Obj.user_id,
                        deviceInfo: req.headers['user-agent'],
                    });
                    const refreshTokenResult =
                        await newRefreshTokenModelObj.save();
                    // If token saving is successful
                    if (refreshTokenResult && refreshTokenResult._id) {
                        // ⬇⬇ STORE REFRESH TOKEN IN HTTPONLY COOKIE ⬇⬇
                        resp.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production', // HTTPS (true) in production,
                            sameSite:
                                process.env.NODE_ENV === 'production'
                                    ? 'none'
                                    : 'strict',
                            maxAge:
                                process.env.NODE_ENV === 'production'
                                    ? (7 * 24 * 60 * 60 + (10 * 60 * 2) / 3) *
                                      1000
                                    : (45 + (15 * 2) / 3) * 1000, // Same as refreshToken deletion time from DB
                            path: '/', // It is telling the browser:
                            // “Hey browser, here is a cookie — but ONLY send it back to me when the request path is EXACTLY "/" ie all routes.
                            // Earlier, I have set its value to '/refresh-token' because at that time I wanted cookie to be sent from browser
                            // in this '/refresh-token' route only. But later I realized I need it in '/logout' also. So I changed its value
                            // to '/' ie all routes where we need the cookie in that route or not.
                        });
                        console.log(
                            'USER LOGGED IN AT',
                            new Date().toTimeString()
                        );
                        // 200 OK : Everything valid
                        return resp.json({
                            success: true,
                            user: user_Obj,
                            auth: accessToken,
                            error: null,
                        });
                    } else {
                        // 500 Internal Server Error : Unexpected backend issue.
                        return resp.status(500).json({
                            success: false,
                            user: null,
                            auth: null,
                            error: 'Unexpected error while storing refreshToken',
                        });
                    }
                } else {
                    // 401 Unauthorized : Auth failed
                    return resp.status(401).json({
                        success: false,
                        user: null,
                        auth: null,
                        error: 'Incorrect password, please provide correct password',
                    });
                }
            } else {
                // 404 Not Found : Resource (user) doesn’t exist
                return resp.status(404).json({
                    success: false,
                    user: null,
                    auth: null,
                    error: 'No user exist with the provided email id, kindly signup to proceed',
                });
            }
        } else {
            // 400 Bad Request : Bad request from client side.
            return resp.status(400).json({
                success: false,
                user: null,
                auth: null,
                error: validateRequired(['email', 'password'], body),
            });
        }
    } catch (err) {
        console.log(err);
        // 500 Internal Server Error : Unexpected backend issue.
        return resp.status(500).json({
            success: false,
            user: null,
            auth: null,
            error: 'Login failed due to server error',
        });
    }
});

// Refresh Token endpoint
app.post('/refresh-token', async (req, resp) => {
    await new Promise((res) => setTimeout(res, 500));
    const refreshToken = req.cookies.refreshToken;
    console.log(
        'CALLED REFRESH TOKEN ENDPOINT',
        new Date().toTimeString(),
        refreshToken?.slice(-35, -1)
    );
    if (!refreshToken) {
        console.log('MISSING TOKEN');
        // 401 Unauthenticated, no token provided
        return resp.status(401).json({ error: 'Missing refresh token' });
    }
    // Checking if the refreshToken exist in DB or not
    const isRefreshTokenStoredInDB = await refreshTokensModel.findOne({
        token: refreshToken,
    });
    if (!isRefreshTokenStoredInDB) {
        return resp
            .status(403)
            .json({ error: 'Refresh token no longer valid' });
    }

    // Checking the validity of refresh token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedPayloadFromJWT) => {
            if (err) {
                // Forbidden, invalid token
                return resp.status(403).json({
                    user: null,
                    accessToken: null,
                    error: 'Invalid or expired refresh token',
                });
            }
            const newAccessToken = jwt.sign(
                {
                    user_id: decodedPayloadFromJWT.user_id,
                    name: decodedPayloadFromJWT.name,
                    email: decodedPayloadFromJWT.email,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15s' }
            );
            // 200 OK : Everything valid
            return resp.json({
                user: {
                    user_id: decodedPayloadFromJWT.user_id,
                    name: decodedPayloadFromJWT.name,
                    email: decodedPayloadFromJWT.email,
                },
                accessToken: newAccessToken,
                error: null,
            });
        }
    );
});

// Logout user
app.post('/logout', async (req, resp) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log('CALED LOGOUT', refreshToken);
        if (!refreshToken) {
            // 401 Unauthenticated, no token provided
            return resp
                .status(401)
                .json({ success: true, error: 'Missing refresh token' }); // Success -> true because cookie was already cleared and token was deleted already
        }
        // We don't need to verify the jwt before deleting as it is not a sensitive operation
        const result = await refreshTokensModel.deleteOne({
            token: refreshToken,
        });
        // Returning if deletion is acknowledged
        if (result.acknowledged) {
            // Clear the cookie
            resp.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                path: '/', // same path you used when setting cookie
            });
            // 200 OK : Everything valid
            return resp.json({ success: true, error: null });
        } else {
            // 500 Internal Server Error : Unexpected backend issue.
            return resp.status(500).json({
                success: false,
                error: 'Unexpected error while deleting refreshToken',
            });
        }
    } catch (err) {
        console.log(err);
        // 500 Internal Server Error : Unexpected backend issue.
        return resp.status(500).json({
            success: false,
            error: 'Logout failed due to server error',
        });
    }
});

// Get Products
app.get('/get-products', verifyToken, async (req, resp) => {
    try {
        const user_id = req.user.user_id;
        if (user_id) {
            const results = await productsModel.find({ user_id });
            // 200 OK : Everything valid
            return resp.json({ products: results, error: null });
        }
    } catch (err) {
        // 500 Internal Server Error : Unexpected backend issue.
        console.log(err);
        return resp.status(500).json({
            products: [],
            error: 'Database query failed due to server error',
        });
    }
});

// Get Product
app.get('/product/:id', verifyToken, async (req, resp) => {
    try {
        const product_id = req.params.id;
        if (product_id) {
            const result = await productsModel.find({
                _id: product_id,
            });
            if (result.length == 0) {
                return resp.status(404).json({
                    product: [],
                    error: "Product doesn't exist in the database",
                });
            } else if (result[0].user_id !== req.user.user_id) {
                // Forbidden, not permitted
                return resp.status(403).json({
                    product: [],
                    error: "User doesn't have the required permission",
                });
            } else {
                return resp.json({ product: result[0], error: null });
            }
            // 200 OK : Everything valid
        } else {
            // 400 Bad Request : Bad request from client side.
            return resp.status(400).json({
                product: null,
                error: 'Product id cannot be empty',
            });
        }
    } catch (err) {
        // 500 Internal Server Error : Unexpected backend issue.
        console.log(err);
        return resp.status(500).json({
            product: null,
            error: 'Database query failed due to server error',
        });
    }
});

// Add Product
app.post('/add-product', verifyToken, async (req, resp) => {
    try {
        const body = req.body;
        if (body.name && body.price && body.brand && body.category) {
            const newProductModelObj = new productsModel({
                name: body.name,
                price: body.price,
                brand: body.brand,
                category: body.category,
                user_id: req.user.user_id,
            });
            const result = await newProductModelObj.save();

            // Getting (and returning) created product object if product addition is successful
            if (result && result._id) {
                // 201 Created : Resource (user) was successfully created.
                return resp.status(201).json({
                    product: result,
                    error: null,
                });
            }
        } else {
            // 400 Bad Request : Bad request from client side.
            return resp.json({
                product: null,
                error: validateRequired(
                    ['name', 'price', 'brand', 'category'],
                    body
                ),
            });
        }
    } catch (err) {
        // 500 Internal Server Error : Unexpected backend issue.
        console.log(err);
        return resp.status(500).json({
            product: null,
            error: 'Add product failed due to server error',
        });
    }
});

// Delete Product
app.delete('/product/:id', verifyToken, async (req, resp) => {
    try {
        const product_id = req.params.id;
        if (product_id) {
            const get_product = await productsModel.find({ _id: product_id });

            // Checking if the product exist or not
            if (get_product.length == 0) {
                // 404 Not Found : Resource (product) doesn’t exist
                return resp.status(404).json({
                    success: false,
                    error: "Product doesn't exist in the database",
                });
            }
            // Checking if the product belongs to the user whose token has been authenticated
            else if (get_product[0].user_id !== req.user.user_id) {
                // Forbidden, not permitted
                return resp.status(403).json({
                    success: false,
                    error: "You don't have the required permission to delete it",
                });
            }
            // Deleting the product if the above checks are passed
            else {
                const result = await productsModel.deleteOne({
                    _id: product_id,
                });
                // Returning if deletion is successfull
                if (result.acknowledged && result.deletedCount == 1) {
                    // 200 OK : Everything valid
                    return resp.json({ success: true, error: null });
                } else {
                    // 500 Internal Server Error : Unexpected backend issue.
                    return resp.status(500).json({
                        success: false,
                        error: 'Unexpected error while deleting product',
                    });
                }
            }
        } else {
            // 400 Bad Request : Bad request from client side.
            return resp.status(400).json({
                success: false,
                error: 'Product id cannot be empty',
            });
        }
    } catch (err) {
        // 500 Internal Server Error : Unexpected backend issue.
        console.log(err);
        return resp.status(500).json({
            success: false,
            error: 'Delete product failed due to server error',
        });
    }
});

// Update Product
app.put('/product/:id', verifyToken, async (req, resp) => {
    try {
        const product_id = req.params.id;
        const body = req.body;
        if (
            body.name &&
            body.price &&
            body.brand &&
            body.category &&
            product_id
        ) {
            const get_product = await productsModel.find({ _id: product_id });

            // Checking if the product exist or not
            if (get_product.length == 0) {
                // 404 Not Found : Resource (product) doesn’t exist
                return resp.status(404).json({
                    success: false,
                    error: "Product doesn't exist in the database",
                });
            }
            // Checking if the product belongs to the user whose token has been authenticated
            else if (get_product[0].user_id !== req.user.user_id) {
                // Forbidden, not permitted
                return resp.status(403).json({
                    success: false,
                    error: "You don't have the required permission to update it",
                });
            }
            // Updating the product if the above checks are passed
            else {
                const result = await productsModel.updateOne(
                    { _id: product_id },
                    {
                        $set: {
                            name: body.name,
                            price: body.price,
                            brand: body.brand,
                            category: body.category,
                        },
                    }
                );
                if (
                    result.acknowledged &&
                    result.matchedCount == 1 &&
                    result.modifiedCount == 1
                ) {
                    // 200 OK : Everything valid
                    return resp.json({
                        success: true,
                        message: 'Product updated successfully',
                        error: null,
                    });
                } else if (
                    result.acknowledged &&
                    result.matchedCount == 1 &&
                    result.modifiedCount == 0
                ) {
                    // 200 OK : Everything valid
                    return resp.json({
                        success: true,
                        message: 'No changes were made — data is identical',
                        error: null,
                    });
                } else {
                    // 500 Internal Server Error : Unexpected backend issue.
                    return resp.status(500).json({
                        success: false,
                        error: 'Unexpected error while updating product',
                    });
                }
            }
        } else {
            // 400 Bad Request : Bad request from client side.
            return resp.json({
                success: false,
                error: validateRequired(
                    ['name', 'price', 'brand', 'category'],
                    body
                ),
            });
        }
    } catch (err) {
        console.log(err);
        // 500 Internal Server Error : Unexpected backend issue.
        return resp.status(500).json({
            success: false,
            error: 'Update product failed due to server error',
        });
    }
});

// Search Products Database
app.get('/search/:key', verifyToken, async (req, resp) => {
    try {
        const key = req.params.key;
        if (req.user.user_id) {
            const isSearchQueryNumeric = !isNaN(Number(key));
            const results = await productsModel.find({
                user_id: req.user.user_id,
                $or: [
                    { name: { $regex: key, $options: 'i' } },
                    { brand: { $regex: key, $options: 'i' } },
                    { category: { $regex: key, $options: 'i' } },
                    ...(isSearchQueryNumeric ? [{ price: Number(key) }] : []), // We are doing this beacuse mongoose doesn't allow 'null' inside $or
                ],
            });
            // 200 OK : Everything valid
            return resp.json({ products: results });
        } else {
            // 400 Bad Request : Bad request from client side.
            return resp.json({
                products: [],
                error: 'User id cannot be empty',
            });
        }
    } catch (err) {
        console.log(err);
        // 500 Internal Server Error : Unexpected backend issue.
        return resp.status(500).json({
            products: [],
            error: 'Search products failed due to server error',
        });
    }
});

// Middleware for Token verification
function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decodedPayloadFromJWT) => {
                if (err) {
                    // Forbidden, invalid token
                    return resp.status(403).json({
                        error: 'Invalid or expired authentication token',
                    });
                } else {
                    req.user = decodedPayloadFromJWT;
                    return next();
                }
            }
        );
    } else {
        // 401 Unauthenticated, no token provided
        return resp.status(401).json({
            error: 'Missing authentication token',
        });
    }
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(
        `Server running on port ${PORT} & Environment = ${process.env.NODE_ENV}`
    )
);
