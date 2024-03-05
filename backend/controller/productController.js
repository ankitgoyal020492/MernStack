const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary").v2;



//Create a Product == Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    const imagesLinks = [];
    const images = req.files;
    for (let i = 0; i < images.length; i++) {
        const b64 = Buffer.from(images[i].buffer).toString("base64");
        let dataURI = "data:" + images[i].mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id; // to save the logged in user id that created the product
    const product = await Product.create(req.body);
    return res.status(201).json({
        success: true,
        product
    });
});

//update a Product == Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    if (product) {
        let imagesLinks = [];
        const images = req.files;
        for (let i = 0; i < images.length; i++) {
            const b64 = Buffer.from(images[i].buffer).toString("base64");
            let dataURI = "data:" + images[i].mimetype + ";base64," + b64;
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "products",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        if (req.body.removedOldImages != "") {
            let removedImages = JSON.parse(req.body.removedOldImages);
            if (removedImages?.length > 0) {
                for (let i = 0; i < req.body.removedOldImages.length; i++) {
                    await cloudinary.uploader.destroy(req.body.removedOldImages[i]);
                }
            }
        }
        if (req.body.oldImages != "") {
            let oldImages = JSON.parse(req.body.oldImages);
            
            if (oldImages?.length > 0) {
                oldImages = oldImages.map(({ _id, ...rest }) => rest);
                imagesLinks = [...imagesLinks, ...oldImages];
                
            }
        }
        req.body.images = imagesLinks;
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
    return res.status(200).json({
        success: true,
        product
    });
});
//delete a Product == Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
        if (product.images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
            }
        }
    }

    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

//Get Product detail
exports.getProductDetail = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    return res.status(200).json({
        success: true,
        product
    });
});

//Get all the products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = req.query.resultPerPage || 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product, req.query).search().filter();
    let products = await apiFeature.query;
    let filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);
    //products = await apiFeature.query;
    return res.status(201).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount
    });

});

/// Create or update the review

exports.createUpdateProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    const isReviewed = product.reviews.find(rev => rev.user.toString() === review.user.toString());

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === review.user.toString()) {
                rev.rating = rating, rev.comment = comment
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReview = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating
    }) / product.reviews.length;
    product.ratings = avg;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    });
})

// Get all reviews of a Product 
exports.getProductReviews = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id).populate("reviews.user", "name email");
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    return res.status(200).json({
        success: true,
        review: product.reviews
    });
});
// Delete Product review 
exports.deleteProductReview = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.body.productId);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== (req.params.id).toString());
    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating
    }) / reviews.length;
    const ratings = avg;
    const numOfReview = reviews.length;
    await Product.findByIdAndUpdate(req.body.productId, { reviews, ratings, numOfReview }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    return res.status(200).json({
        success: true,
        review: product.reviews
    });
});


//Admin All Products
exports.getAllAdminProduct = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    return res.status(201).json({
        success: true,
        products
    });

});