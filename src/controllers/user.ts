import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";

//* /api/v1/user/new
export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, photo, gender, dob } = req.body;

    let user = await User.findById(_id);

    //* User already exists
    if (user) {
      return res.status(200).json({
        success: "true",
        message: `Welcome, ${user.name}!`,
      });
    }

    if (!_id || !name || !email || !photo || !gender || !dob) {
      next(new ErrorHandler("Please add all the fields", 400));
    }

    user = await User.create({
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

//* /api/v1/user/all
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

//* /api/v1/user/dynamic-id
export const getUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 400));
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

//* /api/v1/user/dynamic-id
export const deleteUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 400));
  }

  await User.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
