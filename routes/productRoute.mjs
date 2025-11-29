import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getActiveProducts,
  getInActiveProducts
} from "../controllers/productController.mjs";

import userController from "../controllers/userController.mjs";
import requireAdmin from "../middleware/roleCheck.mjs";
import { upload } from "../config/cloudinaryConfigProduct.mjs";

const router = express.Router();

// ADMIN ONLY
router.post(
  "/",
  userController.auth,
  requireAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  createProduct
);

router.put(
  "/:id",
  userController.auth,
  requireAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  updateProduct
);

router.delete("/:id", userController.auth, requireAdmin, deleteProduct);

// PUBLIC
router.get("/", getProducts);
router.get("/active", getActiveProducts);
router.get("/inactive", getInActiveProducts);
router.get("/:id", getProduct);

export default router;
