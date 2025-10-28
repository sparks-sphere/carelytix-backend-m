import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import {
  createSalon,
  deleteSalon,
  getAllSalons,
  getSalonById,
  updateSalon,
} from "../controllers/salon.controller";

const router: Router = express.Router();

router.post("/create-salon", isAuthenticated, createSalon);
router.get("/get-all-salons", isAuthenticated, getAllSalons);
router.get("/get-salon/:id", isAuthenticated, getSalonById);
router.put("/update-salon/:id", isAuthenticated, updateSalon);
router.delete("/delete-salon/:id", isAuthenticated, deleteSalon);

export default router;
