import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";
import { createReviewSchema } from "../utils/schema";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const result = createReviewSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { rating, comments, customerId, bookingId } = result.data;

    const review = await prisma.review.create({
      data: {
        rating,
        comments,
        customerId,
        bookingId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, review, "Review created!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          service: {
            branch: {
              saloon: {
                ownerId: userId,
              },
            },
          },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, reviews, "Reviews fetched!"));
  } catch (error) {
    return next(error);
  }
};
