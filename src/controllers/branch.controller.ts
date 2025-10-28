import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import {
  createBranchSchema,
  deleteBranchSchema,
  updateBranchSchema,
} from "../utils/schema";
import { ApiResponse } from "../utils/lib/responce/api-response";

export const createBranch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = createBranchSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }
    const { name, address, city, pincode, contactNo, saloonId, branchCode } =
      result.data;
    const existingSalon = await prisma.saloon.findFirst({
      where: { id: saloonId },
    });

    if (!existingSalon) {
      return next(new NotFoundError("Salon not found!"));
    }

    const newBranch = await prisma.branch.create({
      data: {
        name,
        address,
        city,
        pincode,
        contactNo,
        saloonId,
        branchCode,
        type: "branch",
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(201, newBranch, "Branch created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllBranches = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const saloonId = req.params.id;
    const branches = await prisma.branch.findMany({
      where: { saloonId: saloonId },
      include: { saloon: true },
    });

    if (!branches || branches.length === 0) {
      return next(new NotFoundError("No branches found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, branches, "Branches fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getSingleBranch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;

    const branch = await prisma.branch.findFirst({
      where: { id: branchId },
      include: { saloon: true },
    });

    if (!branch) {
      return next(new NotFoundError("Branch not found!"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, branch, "Branch fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const updateBranch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;
    const result = updateBranchSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, address, city, pincode, contactNo, branchCode } = result.data;

    const existingBranch = await prisma.branch.findFirst({
      where: { id: branchId },
    });

    if (!existingBranch) {
      return next(new NotFoundError("Branch not found!"));
    }

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        name,
        address,
        city,
        pincode,
        contactNo,
        branchCode,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedBranch, "Branch updated successfully!"),
      );
  } catch (error) {
    return next(error);
  }
};

export const deleteBranch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;
    const result = deleteBranchSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { saloonId } = result.data;

    const existingBranch = await prisma.branch.findFirst({
      where: { id: branchId, saloonId: saloonId },
    });

    if (!existingBranch) {
      return next(new NotFoundError("Branch not found!"));
    }

    if (existingBranch.type === "main") {
      return next(new ValidationError("Main branch cannot be deleted!"));
    }

    await prisma.branch.delete({
      where: { id: branchId, saloonId: saloonId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Branch deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
