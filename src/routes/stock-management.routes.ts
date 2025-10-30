import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import {
  addStock,
  updateStockEntry,
} from "../controllers/stock-management.controller";

const router: Router = express.Router();

router.post("/add-stock", isAuthenticated, addStock);
router.put("/update-stock-entry/:id", isAuthenticated, updateStockEntry);

export default router;
