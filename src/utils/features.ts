import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { cache } from "../app.js";
import { Product } from "../models/product.js";

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
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    const products = await Product.find({}).select("_id");

    products.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });

    cache.del(productKeys);
  }

  if (order) {
  }

  if (admin) {
  }
};
