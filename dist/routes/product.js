import express from "express";
import { deleteProductByID, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getProductByID, newProduct, updateProduct, } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
//* To acquire photo from req.file
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
//* /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);
//* /api/v1/product/all
app.get("/all", getAllProducts);
//* /api/v1/product/latest
app.get("/latest", getLatestProducts);
//* /api/v1/product/categories
app.get("/categories", getAllCategories);
//* /api/v1/product/admin-products
app.get("/admin-products", getAdminProducts);
//* /api/v1/product/:id
app
    .route("/:id")
    .get(getProductByID)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProductByID);
export default app;
