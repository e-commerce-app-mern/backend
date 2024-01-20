import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

//* Middleware to ensure that the user is an admin
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new ErrorHandler("Unauthorized User", 401));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not Found", 401));
  }

  if (user.role !== "admin") {
    return next(new ErrorHandler("Unauthorized User", 403));
  }

  //* Next handler is called
  next();
});
