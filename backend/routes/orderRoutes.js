const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createOrder, getSingleOrder, myOrders, updateOrder, deleteOrder, getAllOrders } = require("../controller/orderController");
const Router = express.Router();

Router.route("/order/new").post(isAuthenticatedUser, createOrder);
Router.route("/order/user").get(isAuthenticatedUser, myOrders);

Router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
Router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);
Router.route("/admin/order/all").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

module.exports = Router;