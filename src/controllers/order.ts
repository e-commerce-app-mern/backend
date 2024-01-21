import { NextFunction, Request, Response } from "express";
import { cache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";

export const myOrders = TryCatch(
  async (req: Request<{}, {}, {}, { id?: string }>, res, next) => {
    const { id: user } = req.query;

    const key = `my-orders-${user}`;

    let orders = [];

    if (cache.has(key)) {
      orders = JSON.parse(cache.get(key) as string);
    } else {
      orders = await Order.find({ user });

      cache.set(key, JSON.stringify(orders));
    }

    return res.status(200).json({ success: true, orders });
  }
);

export const allOrders = TryCatch(async (req, res, next) => {
  const key = "all-orders";

  let orders = [];

  if (cache.has(key)) {
    orders = JSON.parse(cache.get(key) as string);
  } else {
    orders = await Order.find().populate("user", "name");

    cache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({ success: true, orders });
});

export const getOrderById = TryCatch(
  async (req: Request<{ id?: string }>, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;

    let order;

    if (cache.has(key)) {
      order = JSON.parse(cache.get(key) as string);
    } else {
      order = await Order.findById(id).populate("user", "name");

      if (!order) {
        return next(new ErrorHandler("Order not Found", 404));
      }

      cache.set(key, JSON.stringify(order));
    }

    return res.status(200).json({ success: true, order });
  }
);

export const newOrder = TryCatch(
  async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems);

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res
      .status(201)
      .json({ success: true, message: "Order placed Successfully" });
  }
);

export const processOrder = TryCatch(
  async (req: Request<{ id?: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    switch (order.status) {
      case "Processing": {
        order.status = "Shipped";
        break;
      }
      case "Shipped": {
        order.status = "Delivered";
        break;
      }
      default: {
        order.status = "Delivered";
        break;
      }
    }

    await order.save();

    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });

    return res
      .status(201)
      .json({ success: true, message: "Order processed Successfully" });
  }
);

export const deleteOrder = TryCatch(
  async (req: Request<{ id?: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    await order.deleteOne();

    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });

    return res
      .status(201)
      .json({ success: true, message: "Order deleted Successfully" });
  }
);
