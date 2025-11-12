import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";
import { createSlotSchema, updateSlotSchema } from "src/utils/schema";

export const createSlot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = createSlotSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { slotStart, slotEnd, branchId, staffId } = result.data;
    if (!slotStart || !slotEnd || !branchId) {
      throw new ValidationError("Invalid request data");
    }

    const start = new Date(slotStart);
    const end = new Date(slotEnd);

    if (start > end) {
      throw new ValidationError("Invalid request data");
    }

    const existingBranch = await prisma.branch.findFirst({
      where: { id: branchId },
    });

    if (!existingBranch) {
      return next(new NotFoundError("Branch not found!"));
    }

    const existingStaff = await prisma.staff.findFirst({
      where: { id: staffId },
    });

    if (!existingStaff) {
      return next(new NotFoundError("Staff not found!"));
    }

    const overlappingSlots = await prisma.availableSlot.findFirst({
      where: {
        branchId,
        staffId,
        OR: [
          {
            AND: [{ slotStart: { lte: start } }, { slotEnd: { gte: start } }],
          },
        ],
      },
    });

    if (overlappingSlots) {
      return res.status(400).json({
        success: false,
        message: "This slot overlaps with an existing slot",
      });
    }

    const slot = await prisma.availableSlot.create({
      data: {
        slotStart: start,
        slotEnd: end,
        branchId,
        staffId: staffId || null,
        isAvailable: true,
      },
      include: {
        branch: true,
        staff: true,
      },
    });

    return res.status(200).json(new ApiResponse(200, slot, "Slot created!"));
  } catch (error) {
    return next(error);
  }
};

export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;
    const { date } = req.query;

    if (!branchId) {
      throw new ValidationError("Invalid request data");
    }

    const slots = await prisma.availableSlot.findMany({
      where: {
        branchId: branchId,
        isAvailable: true,
        slotStart: { gte: new Date() },
        slotEnd: { gte: new Date() },
      },
      include: { branch: true, staff: true },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { slots, date }, "Slots fetched successfully!"),
      );
  } catch (error) {
    return next(error);
  }
};

export const getAllSlots = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const branchId = req.params.id;
    const { date } = req.query;

    if (!branchId) {
      throw new ValidationError("Invalid request data");
    }

    const slots = await prisma.availableSlot.findMany({
      where: {
        branchId: branchId,
      },
      include: { branch: true, staff: true },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { slots, date }, "Slots fetched successfully!"),
      );
  } catch (error) {
    return next(error);
  }
};

export const deleteSlot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slotId = req.params.id;
    const result = await prisma.availableSlot.delete({
      where: { id: slotId },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Slot deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
