import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    return next(error);
  }
};
