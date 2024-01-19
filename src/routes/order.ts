import express from "express";
import {
  allOrders,
  deleteOrder,
  getOrderById,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

//* /api/v1/order/new
app.post("/new", newOrder);

//* /api/v1/order/my-orders
app.get("/my-orders", myOrders);

//* /api/v1/order/all
app.get("/all", adminOnly, allOrders);

//* /api/v1/order/dynamicId
app
  .route("/:id")
  .get(getOrderById)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
