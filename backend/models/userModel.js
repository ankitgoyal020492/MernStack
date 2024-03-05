const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter user name"],
        maxLength: [20, "Name can not exceeds 10 letter"],
        minLength: [5, "Name should be greater than 5 letter"]
    },
    email: {
        type: String,
        required: [true, "Please enter user email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter user password"],
        maxLength: [20, "Password can not exceeds 10 letter"],
        minLength: [8, "Password should be greater than 5 letter"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Check if password is updated or not, if updated then only bcrypt the new password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//Generate the jwt token to authenticate the user
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}
// Compare the bcrypt with during login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generate password reset token
userSchema.methods.getUserResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing the token and added to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;
    
    return resetToken;
}

module.exports = mongoose.model("users", userSchema);