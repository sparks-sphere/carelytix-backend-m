import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import { getDashBoardData } from "../controllers/admin.controller";

const router: Router = express.Router();

router.get("/get-dashboard-data", isAuthenticated, getDashBoardData);

export default router;
