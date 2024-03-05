const express = require("express");


const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail, createUpdateProductReview, getProductReviews, deleteProductReview, getAllAdminProduct } = require("../controller/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const Router = express.Router();
const multer  = require('multer');
const upload = multer();

Router.route("/products").get(getAllProducts);
Router.route("/admin/product/all").get(isAuthenticatedUser, authorizeRoles("admin"), getAllAdminProduct);
Router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), upload.array('images', 10), createProduct);
Router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), upload.array('images', 10), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

Router.route("/product/review").put(isAuthenticatedUser, createUpdateProductReview);
Router.route("/admin/product/reviews/:id").get(getProductReviews).delete(isAuthenticatedUser, deleteProductReview);

Router.route("/product/:id").get(getProductDetail);
module.exports = Router;