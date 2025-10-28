import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller";

const router: Router = express.Router();

router.post("/create-service", isAuthenticated, createService);
router.get("/get-all-services", isAuthenticated, getAllServices);
router.get("/get-service/:id", isAuthenticated, getServiceById);
router.put("/update-service/:id", isAuthenticated, updateService);
router.delete("/delete-service/:id", isAuthenticated, deleteService);

export default router;
