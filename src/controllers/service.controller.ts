import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";
import { createServiceSchema, updateServiceSchema } from "../utils/schema";

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    const result = createServiceSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, price, description, durationMinutes, branchId } = result.data;

    const branch = await prisma.branch.findFirst({
      where: { id: branchId },
      include: { saloon: true },
    });

    if (!branch) {
      return next(new NotFoundError("Branch not found!"));
    }

    const staff = await prisma.staff.findFirst({
      where: {
        branchId: branchId,
        role: "head_of_operation",
      },
    });

    if (branch.saloon.ownerId !== userId || staff?.id !== userId) {
      return next(
        new ValidationError(
          "Only the salon owner or branch manager can add staff!",
        ),
      );
    }

    let data: {
      name: string;
      price: number;
      branchId: string;
      description?: string;
      durationMinutes?: number;
    } = {
      name: name,
      price: parseFloat(price),
      branchId: branchId,
    };

    if (description) data.description = description;
    if (durationMinutes) data.durationMinutes = Number(durationMinutes);

    const service = await prisma.service.create({
      data: data,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          service,
          `Service created for branch ${branch.name}`,
        ),
      );
  } catch (error) {
    return next(error);
  }
};

export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    const service = await prisma.service.findMany({
      where: {
        branch: {
          saloon: {
            ownerId: userId,
          },
        },
      },
      include: {
        branch: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Services fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const serviceId = req.params.id;

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        branch: {
          saloon: {
            ownerId: userId,
          },
        },
      },
    });

    if (!service) {
      return next(new NotFoundError("Service not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Service fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }

    const serviceId = req.params.id;
    if (!serviceId) {
      throw new ValidationError("Service id not provided");
    }

    const result = updateServiceSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, price, description, durationMinutes } = result.data;

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        price,
        description,
        durationMinutes: Number(durationMinutes),
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedService, "Service updated successfully!"),
      );
  } catch (error) {
    return next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }

    const serviceId = req.params.id;
    if (!serviceId) {
      throw new ValidationError("Service id not provided");
    }

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        branch: {
          saloon: {
            ownerId: ownerId,
          },
        },
      },
    });

    if (!service) {
      return next(new NotFoundError("Service not found!"));
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Service deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
