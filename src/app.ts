import { config } from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import Stripe from "stripe";
import { connectDB } from "./utils/features.js";
import cors from "cors";

//* Import Routes
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import productRoute from "./routes/product.js";
import dashboardRoute from "./routes/stats.js";
import userRoute from "./routes/user.js";

//* Import Middlewares
import { errorMiddleware } from "./middlewares/error.js";

config({
  path: "./.env",
});

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

//* DB connection
connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);

//* Implement Data Caching
export const cache = new NodeCache();

const app = express();

//* Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//* Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API Working with /api/v1");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

//* Access image files in uploads
//* Uploads folder is declared static to serve static files
app.use("/uploads", express.static("uploads"));

//* Middleware for handling errors
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
