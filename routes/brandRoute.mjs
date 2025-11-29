import express from "express";
import {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand
} from "../controllers/brandController.mjs";
import userController from "../controllers/userController.mjs";
import requireAdmin from "../middleware/roleCheck.mjs";

const router = express.Router();

router.post("/", userController.auth, requireAdmin, createBrand); 
router.get("/", userController.auth, requireAdmin, getBrands);
router.get("/:id", userController.auth, requireAdmin, getBrand);
router.put("/:id", userController.auth, requireAdmin, updateBrand);
router.delete("/:id", userController.auth, requireAdmin, deleteBrand);

export default router;
