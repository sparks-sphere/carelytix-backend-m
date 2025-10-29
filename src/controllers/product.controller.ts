import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";
import {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
} from "../utils/schema";

export const createProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const result = createProductSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const {
      productId,
      name,
      description,
      category,
      quantity,
      volume,
      price,
      costPrice,
      gst,
      hsn,
      batchCode,
      manufacturer,
      expiry,
      shelfLifeInDays,
      triggerNotificationInDays,
      noOfUses,
      status,
    } = result.data;

    const existingProduct = await prisma.product.findUnique({
      where: { productId },
    });
    if (existingProduct) {
      throw new ValidationError("Product with this Product ID already exists!");
    }

    const product = await prisma.product.create({
      data: {
        productId,
        name,
        description,
        category,
        quantity: quantity || 0,
        volume,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        gst: parseFloat(gst),
        hsn,
        batchCode,
        manufacturer,
        expiry: expiry ? new Date(expiry) : null,
        shelfLifeInDays: Number(shelfLifeInDays),
        triggerNotificationInDays: Number(triggerNotificationInDays),
        noOfUses: Number(noOfUses),
        status: status || "draft",
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const productId = req.params.id;
    if (!productId) {
      throw new ValidationError("Product id not provided");
    }

    const result = updateProductSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return next(new NotFoundError("Product not found!"));
    }

    const {
      name,
      description,
      category,
      volume,
      price,
      costPrice,
      gst,
      hsn,
      batchCode,
      manufacturer,
      expiry,
      shelfLifeInDays,
      triggerNotificationInDays,
      noOfUses,
    } = result.data;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        category,
        volume,
        price: price ? parseFloat(price) : undefined,
        costPrice: costPrice ? parseFloat(costPrice) : undefined,
        gst: gst ? parseFloat(gst) : undefined,
        hsn,
        batchCode,
        manufacturer,
        expiry: expiry ? new Date(expiry) : undefined,
        shelfLifeInDays: shelfLifeInDays ? Number(shelfLifeInDays) : undefined,
        triggerNotificationInDays: triggerNotificationInDays
          ? Number(triggerNotificationInDays)
          : undefined,
        noOfUses: noOfUses ? Number(noOfUses) : undefined,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully!"),
      );
  } catch (error) {
    return next(error);
  }
};

export const updateProductStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const productId = req.params.id;
    if (!productId) {
      throw new ValidationError("Product id not provided");
    }

    const result = updateProductStatusSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { status } = result.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return next(new NotFoundError("Product not found!"));
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { status },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedProduct,
          "Product status updated successfully!",
        ),
      );
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const productId = req.params.id;
    if (!productId) {
      throw new ValidationError("Product id not provided");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        billItems: true,
        serviceMappings: true,
      },
    });

    if (!product) {
      return next(new NotFoundError("Product not found!"));
    }

    // Check if product is used in any bills
    if (product.billItems.length > 0) {
      throw new ValidationError(
        "Cannot delete product that has been used in bills!",
      );
    }

    // Delete service mappings first
    if (product.serviceMappings.length > 0) {
      await prisma.serviceProductMapping.deleteMany({
        where: { productId: productId },
      });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getLowStockProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const { threshold = "10" } = req.query;

    const products = await prisma.product.findMany({
      where: {
        quantity: {
          lte: Number(threshold),
        },
        status: {
          in: ["available", "not_available"],
        },
      },
      orderBy: {
        quantity: "asc",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          "Low stock products fetched successfully!",
        ),
      );
  } catch (error) {
    return next(error);
  }
};

export const getExpiringProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const { days = "30" } = req.query;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Number(days));

    const products = await prisma.product.findMany({
      where: {
        expiry: {
          lte: futureDate,
          gte: new Date(),
        },
        status: {
          in: ["available", "not_available"],
        },
      },
      orderBy: {
        expiry: "asc",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          "Expiring products fetched successfully!",
        ),
      );
  } catch (error) {
    return next(error);
  }
};
