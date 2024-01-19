import { newOrder } from "../controllers/order.js";
import express from "express";
const app = express.Router();
//* /api/v1/order/new
app.post("/new", newOrder);
export default app;
