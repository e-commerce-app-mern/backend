import express from "express";
import { connectDB } from "./utils/features.js";
import NodeCache from "node-cache";
//* Import Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
//* Import Middlewares
import { errorMiddleware } from "./middlewares/error.js";
const port = 4000;
//* DB connection
connectDB();
//* Implement Data Caching
export const cache = new NodeCache();
const app = express();
//* Middlewares
app.use(express.json());
//* Routes
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
//* Access image files in uploads
//* Uploads folder is declared static to serve static files
app.use("/uploads", express.static("uploads"));
//* Middleware for handling errors
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
