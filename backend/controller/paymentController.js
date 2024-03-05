const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        metadata: {
            company: "Ecommerce",
        },
    });

    res.status(200)
        .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
    const { amount, shipping  } = req.body;
    if (!amount) return next(new ErrorHandler("Please enter amount", 400));
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
        description: 'Ecommerce Software development services',
        shipping:shipping
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});
