import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error.js";
import prisma from "../db/prisma.js";
import { ApiResponse } from "../utils/lib/responce/api-response.js";
import { createStaffSchema, updateStaffSchema } from "../utils/schema.js";

export const createStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = createStaffSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, contactNumber, role, address, branchId } = result.data;

    const branch = await prisma.branch.findFirst({
      where: { id: branchId },
      include: { saloon: true },
    });

    if (!branch) {
      return next(new NotFoundError("Branch not found!"));
    }

    if (branch.saloon.ownerId !== req.user?.id) {
      return next(
        new ValidationError(
          "Only the salon owner or branch manager can add staff!",
        ),
      );
    }

    const branchHead = await prisma.staff.findFirst({
      where: { id: req.user?.id, role: "head_of_operation" },
    });
    if (!branchHead) {
      return next(new ValidationError("Only branch head can add staff!"));
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        role,
        contactNumber,
        address,
        branchId,
        userId: req.user?.id,
      },
    });

    return res.status(201).json(new ApiResponse(201, staff, "Staff created!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staffs = await prisma.staff.findMany({
      where: {
        branch: {
          saloon: {
            ownerId: req.user?.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!staffs || staffs.length === 0) {
      return next(new NotFoundError("No staff found!"));
    }

    return res.status(200).json(new ApiResponse(200, staffs, "Staff fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const getStaffById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staffId = req.params.id;

    const staff = prisma.staff.findUnique({
      where: { id: staffId },
    });

    if (!staff) {
      return next(new NotFoundError("Staff not found!"));
    }

    return res.status(200).json(new ApiResponse(200, staff, "Staff fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const updateStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staffId = req.params.id;
    if (!staffId) {
      return next(new ValidationError("Invalid staff id"));
    }

    const result = updateStaffSchema.safeParse(req.body);

    if (result.error) {
      return next(new ValidationError(result.error.message));
    }

    const { name, role, contactNumber, address, branchId } = result.data;

    let userId = req.user.id;
    if (!userId) {
      return next(new ValidationError("Invalid user id"));
    }

    // Check if the person updating staff is branch head
    const staff = prisma.staff.findUnique({
      where: {
        id: userId,
        role: "head_of_operation",
      },
    });
    if (!staff) {
      return next(new ValidationError("Only branch head can update staff!"));
    }

    // Check if the person updating staff is branch head
    const branch = await prisma.branch.findFirst({
      where: { id: branchId },
      include: { saloon: true },
    });

    if (!branch) {
      return next(new NotFoundError("Branch not found!"));
    }

    if (branch.saloon.ownerId !== userId) {
      return next(
        new ValidationError(
          "Only the salon owner or branch manager can add staff!",
        ),
      );
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: {
        name,
        role,
        contactNumber,
        address,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedStaff, "Staff updated!"));
  } catch (error) {
    return next(error);
  }
};

export const deleteStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staffId = req.params.id;
    if (!staffId) {
      return next(new ValidationError("Invalid staff id"));
    }

    const staff = prisma.staff.findUnique({
      where: { id: staffId },
    });

    if (!staff) {
      return next(new NotFoundError("Staff not found!"));
    }

    await prisma.staff.delete({
      where: { id: staffId },
    });

    return res.status(200).json(new ApiResponse(200, null, "Staff deleted!"));
  } catch (error) {
    return next(error);
  }
};
