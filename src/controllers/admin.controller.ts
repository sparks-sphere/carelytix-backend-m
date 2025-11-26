import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  ValidationError,
} from "../utils/error-handler/app-error";
import prisma from "../db/prisma";
import { ApiResponse } from "../utils/lib/responce/api-response";

export const getDashBoardData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      throw new ValidationError("Invalid request data");
    }

    // Get date for last month
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(0);
    lastMonthEnd.setHours(23, 59, 59, 999);

    // Fetch essential dashboard data in parallel
    const [
      totalUsers,
      totalSaloons,
      totalBranches,
      allTimeRevenue,
      lastMonthRevenue,
      activeSubscriptions,
      recentUsers,
    ] = await Promise.all([
      // Total Users (Salon Owners)
      prisma.user.count(),

      // Total Saloons
      prisma.saloon.count(),

      // Total Branches
      prisma.branch.count(),

      // All Time Revenue
      prisma.bill.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),

      // Last Month Revenue
      prisma.bill.aggregate({
        where: {
          billDate: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Active Subscriptions
      prisma.userPlanMapping.count({
        where: { isActive: true },
      }),

      // Recent Users (last 5)
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
          isVerified: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate average branches per saloon
    const avgBranchesPerSaloon =
      totalSaloons > 0 ? (totalBranches / totalSaloons).toFixed(2) : 0;

    // Build the dashboard response
    const dashboardData = {
      totalUsers,
      totalSaloons,
      totalBranches,
      avgBranchesPerSaloon: parseFloat(avgBranchesPerSaloon as string),
      revenue: {
        allTime: allTimeRevenue._sum.totalAmount || 0,
        lastMonth: lastMonthRevenue._sum.totalAmount || 0,
      },
      activeSubscriptions,
      recentUsers,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dashboardData,
          "Dashboard data fetched successfully",
        ),
      );
  } catch (error) {
    return next(error);
  }
};
