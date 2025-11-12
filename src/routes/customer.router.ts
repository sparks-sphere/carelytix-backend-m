import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import { createCustomer } from "../controllers/customer.controller";

const router: Router = express.Router();

router.post("/create-customer/:id", isAuthenticated, createCustomer);

export default router;
