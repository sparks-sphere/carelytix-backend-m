import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
} from "../controllers/booking.controller";

const router: Router = express.Router();

router.post("/:id/create-booking", isAuthenticated, createBooking);
router.get("/:id/get-all-booking", isAuthenticated, getAllBookings);
router.get("/get-booking/:id", isAuthenticated, getBookingById);
router.delete("/delete-booking/:id", isAuthenticated, deleteBooking);

export default router;
