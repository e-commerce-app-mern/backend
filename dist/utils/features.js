import mongoose from "mongoose";
import { cache } from "../app.js";
import { Product } from "../models/product.js";
export const connectDB = async (uri) => {
    try {
        const db = await mongoose.connect(uri, {
            dbName: "Ecommerce_MERN",
        });
        console.log(`Database connected to ${db.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};
export const invalidateCache = async ({ product, order, admin, userId, productId, orderId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string") {
            productKeys.push(`product-${productId}`);
        }
        if (typeof productId === "object") {
            productKeys.forEach((i) => productKeys.push(`product-${i}`));
        }
        cache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        cache.del(orderKeys);
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (const order of orderItems) {
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
