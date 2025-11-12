import e, { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";
import { createCustomerSchema } from "src/utils/schema";

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;
    if (!branchId) {
      throw new ValidationError("Invalid request data");
    }

    const result = createCustomerSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, mobile, email, place } = result.data;

    if (!name || !mobile) {
      throw new ValidationError("Invalid request data");
    }

    let data: {
      name: string;
      mobile: string;
      email?: string;
      place?: string;
    } = {
      name,
      mobile,
    };

    if (email) {
      data.email = email;
    }
    if (place) {
      data.place = place;
    }

    const customer = await prisma.customer.create({
      data: { ...data, branchId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, customer, "Customer created successfully!"));
  } catch (error) {
    return next(error);
  }
};
