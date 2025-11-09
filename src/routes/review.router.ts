import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import { createReview, getAllReviews } from "../controllers/review.controller";

const router: Router = express.Router();

router.post("/create-review", isAuthenticated, createReview);
router.get("/get-all-reviews", isAuthenticated, getAllReviews);

export default router;
