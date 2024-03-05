const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser,  deleteUser, updateUserDetailAndRole } = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const Router = express.Router();


const multer  = require('multer');
const upload = multer();

Router.route("/register").post(upload.single('avatar'), registerUser);
Router.route("/login").post(loginUser);
Router.route("/forgot-password").post(forgotPassword);
Router.route("/password/reset/:token").put(resetPassword);
Router.route("/logout").get(logoutUser);
Router.route("/profile").get(isAuthenticatedUser, getUserDetails);
Router.route("/update-password").put(isAuthenticatedUser, updatePassword);
Router.route("/update-profile").put(isAuthenticatedUser, upload.single('avatar'), updateProfile);
Router.route("/admin/user/all").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
Router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserDetailAndRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = Router;