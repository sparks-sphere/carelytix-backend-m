import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import {
  createSlot,
  deleteSlot,
  getAllSlots,
  getAvailableSlots,
} from "../controllers/slot.controller";

const router: Router = express.Router();

router.post("/create-slot", isAuthenticated, createSlot);
router.get("/:id/get-all-slots", isAuthenticated, getAllSlots);
router.get("/:id/get-available-slots", isAuthenticated, getAvailableSlots);
router.delete("/delete-slot/:id", isAuthenticated, deleteSlot);

export default router;
