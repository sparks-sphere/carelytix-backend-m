import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";
import {
  createStockUpdateSchema,
  updateStockUpdateSchema,
} from "../utils/schema";

export const addStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const productId = req.params.productId;
    if (!productId) {
      throw new ValidationError("Product id not provided");
    }

    const result = createStockUpdateSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { dateOfPurchase, volume, quantity, costPrice } = result.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return next(new NotFoundError("Product not found!"));
    }

    const [stockUpdate, updatedProduct] = await prisma.$transaction([
      prisma.stockUpdate.create({
        data: {
          productId,
          dateOfPurchase: new Date(dateOfPurchase),
          volume,
          quantity: Number(quantity),
          costPrice: parseFloat(costPrice),
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          quantity: {
            increment: Number(quantity),
          },
          volume,
          costPrice: parseFloat(costPrice),
          status:
            product.status === "not_available" ? "available" : product.status,
        },
      }),
    ]);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { stockUpdate, updatedProduct },
          "Stock added successfully!",
        ),
      );
  } catch (error) {
    return next(error);
  }
};

export const updateStockEntry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const stockUpdateId = req.params.id;
    if (!stockUpdateId) {
      throw new ValidationError("Stock update id not provided");
    }

    const result = updateStockUpdateSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { dateOfPurchase, volume, quantity, costPrice } = result.data;

    const existingStockUpdate = await prisma.stockUpdate.findUnique({
      where: { id: stockUpdateId },
      include: { product: true },
    });

    if (!existingStockUpdate) {
      return next(new NotFoundError("Stock update not found!"));
    }

    const quantityDifference = quantity
      ? Number(quantity) - existingStockUpdate.quantity
      : 0;

    const [updatedStockUpdate, updatedProduct] = await prisma.$transaction([
      prisma.stockUpdate.update({
        where: { id: stockUpdateId },
        data: {
          dateOfPurchase: dateOfPurchase ? new Date(dateOfPurchase) : undefined,
          volume: volume ? volume : existingStockUpdate.volume,
          quantity: quantity ? Number(quantity) : existingStockUpdate.quantity,
          costPrice: costPrice ? parseFloat(costPrice) : 0,
        },
      }),
      prisma.product.update({
        where: { id: existingStockUpdate.productId },
        data: {
          quantity: {
            increment: quantityDifference,
          },
          volume: volume ? volume : existingStockUpdate.product.volume,
          costPrice: costPrice ? parseFloat(costPrice) : 0,
        },
      }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          updatedStockUpdate,
          updatedProduct,
        },
        "Stock update modified successfully!",
      ),
    );
  } catch (error) {
    return next(error);
  }
};
