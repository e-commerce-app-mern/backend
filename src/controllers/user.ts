import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, photo, gender, dob } = req.body;

    console.log(_id, name, email, photo, gender, dob);

    const user = await User.create({
      _id,
      name,
      email,
      photo,
      gender,
      dob: new Date(dob),
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}!`,
    });
  }
);
