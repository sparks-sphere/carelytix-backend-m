import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";
import { createBookingSchema } from "src/utils/schema";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;
    if (!branchId) {
      throw new ValidationError("Invalid request data");
    }

    const result = createBookingSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { serviceId, customerId, slotId, status } = result.data;
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        customerId,
        slotId,
        status,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking created!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;
    if (!branchId) {
      throw new ValidationError("Invalid request data");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        service: {
          branch: {
            id: branchId,
          },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { bookings }, "Bookings fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = req.params.id;
    if (!bookingId) {
      throw new ValidationError("Invalid request data");
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = req.params.id;
    if (!bookingId) {
      throw new ValidationError("Invalid request data");
    }

    const booking = await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking deleted!"));
  } catch (error) {
    return next(error);
  }
};
