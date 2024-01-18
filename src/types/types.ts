import { NextFunction, Request, Response } from "express";

export type NewUserRequestBody = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
};

export type NewProductRequestBody = {
  name: string;
  price: number;
  stock: number;
  category: string;
};

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface baseQueryType {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}
