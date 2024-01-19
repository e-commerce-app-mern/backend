import mongoose from "mongoose";
import { cache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

export const connectDB = async (uri: string) => {
  try {
    const db = await mongoose.connect(uri, {
      dbName: "Ecommerce_MERN",
    });

    console.log(`Database connected to ${db.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  productId,
  orderId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
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

    const products = await Product.find({}).select("_id");

    products.forEach((i) => {
      productKeys.push();
    });

    cache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    cache.del(orderKeys);
  }

  if (admin) {
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (const order of orderItems) {
    const product = await Product.findById(order.productId);

    if (!product) throw new Error("Product Not Found");

    product.stock -= order.quantity;

    await product.save();
  }
};
