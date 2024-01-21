import { Request } from "express";
import { rm } from "fs";
import { cache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import {
  NewProductRequestBody,
  SearchRequestQuery,
  baseQueryType,
} from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

//* Revalidate on creation, updation or deletion of products, or new orders
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (cache.has("latest-products"))
    products = JSON.parse(cache.get("latest-products") as string);
  else {
    //* Get 5 latest products in descending order of creation time
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    //* Caching products
    cache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({ success: true, products });
});

//* Revalidate on creation, updation or deletion of products, or new orders
export const getAllCategories = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    let categories;

    if (cache.has("categories"))
      categories = JSON.parse(cache.get("categories") as string);
    else {
      categories = await Product.distinct("categories");

      cache.set("categories", JSON.stringify(categories));
    }

    return res.status(200).json({ success: true, categories });
  }
);

//* Revalidate on creation, updation or deletion of products, or new orders
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (cache.has("all-products"))
    products = JSON.parse(cache.get("all-products") as string);
  else {
    products = await Product.find({});

    cache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({ success: true, products });
});

export const getProductByID = TryCatch(async (req, res, next) => {
  let product;
  const { id } = req.params;

  if (cache.has(`product-${id}`))
    product = JSON.parse(cache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    cache.set(`product-${id}`, JSON.stringify(product));
  }

  if (!product) return next(new ErrorHandler("Product not Found", 404));

  return res.status(200).json({ success: true, product });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Photo Deleted");
      });

      return next(new ErrorHandler("Please enter All Fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    invalidateCache({ product: true, admin: true });

    return res
      .status(201)
      .json({ success: true, message: "Product created successfully" });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res
    .status(200)
    .json({ success: true, message: "Product updated successfully", product });
});

export const deleteProductByID = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not Found", 404));

  rm(product.photo, () => {
    console.log("Product Photo Deleted");
  });

  await Product.deleteOne();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    const baseQuery: baseQueryType = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);

    return res.status(200).json({ success: true, products, totalPage });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\8a25a7d3-67f3-4c91-b552-9577e2e69416.jpeg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({success: true})
// };

// generateRandomProducts(40);

// const deleteRandomProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(5);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ success: true });
// };

// deleteRandomProducts(75);
