import { NextFunction, Request, Response } from "express";
import { salonCreationSchema, salonUpdationSchema } from "../utils/schema";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import { ApiResponse } from "../utils/lib/responce/api-response";
import prisma from "../db/prisma";

export const createSalon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) {
      throw new Error("Unauthorized: User not found in request");
    }

    const result = salonCreationSchema.safeParse(req.body);
    if (result.error) {
      return next(new ValidationError("Invalid salon data"));
    }

    const { name } = result.data;
    const existingSalon = await prisma.saloon.findFirst({
      where: { name, ownerId },
    });

    if (existingSalon) {
      return next(new NotFoundError("Salon already exists with this name!"));
    }

    const salon = await prisma.saloon.create({
      data: { name, ownerId },
    });

    const branch = await prisma.branch.create({
      data: {
        name: "Main Branch",
        saloonId: salon.id,
        branchCode: "main",
        type: "main",
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, salon, "Salon created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllSalons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new Error("Unauthorized: User not found in request");
    }

    const salons = await prisma.saloon.findMany({
      where: { ownerId },
      include: { branches: true },
    });

    if (!salons || salons.length === 0) {
      return next(new NotFoundError("No salons found for this user!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, salons, "Salons retrieved successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getSalonById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new Error("Unauthorized: User not found in request");
    }

    const salonId = req.params.id;
    const salon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId },
      include: { branches: true },
    });

    if (!salon) {
      return next(new NotFoundError("Salon not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, salon, "Salon retrieved successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const updateSalon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new Error("Unauthorized: User not found in request");
    }

    const salonId = req.params.id;

    const result = salonUpdationSchema.safeParse(req.body);
    if (result.error) {
      return next(new ValidationError("Invalid salon updation data"));
    }

    const { name } = result.data;

    const existingSalon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId },
    });

    if (!existingSalon) {
      return next(new NotFoundError("Salon not found!"));
    }

    const updatedSalon = await prisma.saloon.update({
      where: { id: salonId },
      data: { name },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedSalon, "Salon updated successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const deleteSalon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }
    const salonId = req.params.id;

    const salon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId: ownerId },
    });

    if (!salon) {
      return next(new NotFoundError("Salon not found!"));
    }

    await prisma.saloon.delete({
      where: { id: salonId, ownerId: ownerId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Salon deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
