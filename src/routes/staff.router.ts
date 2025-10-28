import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index.js";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
} from "../controllers/staff.controller.js";

const router: Router = express.Router();

router.post("/create-staff", isAuthenticated, createStaff);
router.get("/get-all-staff", isAuthenticated, getAllStaff);
router.get("/get-staff/:id", isAuthenticated, getStaffById);
router.put("/update-staff/:id", isAuthenticated, updateStaff);
router.delete("/delete-staff/:id", isAuthenticated, deleteStaff);

export default router;
