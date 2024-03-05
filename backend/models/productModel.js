const mongoose = require("mongoose");

const productScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description."]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price."],
        maxLength: [8, "Price can not exceeds 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category."],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock."],
        maxLength: [4, "Stock can not exceeds 8 characters"],
        default: 1
    },
    numOfReview: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("products", productScheme);