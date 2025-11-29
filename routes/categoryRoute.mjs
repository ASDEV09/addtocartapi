import express from "express";
import {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.mjs";
import userController from "../controllers/userController.mjs";
import requireAdmin from "../middleware/roleCheck.mjs";

const router = express.Router();

router.post("/", userController.auth, requireAdmin, createCategory);       // Create category
router.get("/",getCategories);         // Get all categories
router.get("/:id", userController.auth, requireAdmin, getCategory);        // Get single category
router.put("/:id", userController.auth, requireAdmin, updateCategory);     // Update category
router.delete("/:id", userController.auth, requireAdmin, deleteCategory);  // Delete category

export default router;
