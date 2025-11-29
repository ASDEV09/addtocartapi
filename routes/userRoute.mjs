import userController from "../controllers/userController.mjs";
import express from 'express';
import { upload } from "../config/cloudinaryConfigUser.mjs"; // tumhari multer file
import requireAdmin from "../middleware/roleCheck.mjs";

const userRouter = express.Router();

//fetch all products
userRouter
    .get('/', userController.index)
    .post('/signup', userController.Signup)
    .post('/login', userController.Login)
    .put("/update", userController.auth, upload.single("profilePicture"), userController.updateProfile)
    .post("/forgot-password", userController.forgotPassword)
    .post("/reset-password/:token", userController.resetPassword)
    .put("/admin/update", userController.auth, requireAdmin, upload.single("profilePicture"), userController.updateUserByAdmin)
    .get("/:id", userController.auth, requireAdmin, userController.getUserById)
    .delete("/:id", userController.auth, requireAdmin, userController.deleteUserByAdmin)
    .post("/admin/add", userController.auth, requireAdmin, upload.single("profilePicture"), userController.addUserByAdmin);

export default userRouter;