const express = require("express");

const { isAuthenticatedUser } = require("../middleware/auth");
const { processPayment, sendStripeApiKey } = require("../controller/paymentController");
const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processPayment);

router.route("/payment/create").post(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
