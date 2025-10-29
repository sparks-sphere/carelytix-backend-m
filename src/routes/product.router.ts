import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth/index";
import {
  createProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getExpiringProducts,
  getLowStockProducts,
} from "../controllers/product.controller";

const router: Router = express.Router();

router.post("/create-product", isAuthenticated, createProducts);
router.get("/get-all-products", isAuthenticated, getAllProducts);
router.get("/get-product/:id", isAuthenticated, getProductById);
router.put("/update-product/:id", isAuthenticated, updateProduct);
router.delete("/delete-product/:id", isAuthenticated, deleteProduct);
router.put("/update-product-status/:id", isAuthenticated, updateProductStatus);
router.get("/get-expiring-products", isAuthenticated, getExpiringProducts);
router.get("/get-low-stock-products", isAuthenticated, getLowStockProducts);

export default router;
