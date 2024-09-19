const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErorr = require("../utils/ExpressError.js");
const Reviews = require("../models/reviews.js");
const {reviewSchema} = require("../schema.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.map((el)=>el.message).join(",");
        throw new ExpressErorr(400,errorMsg);
    }else{
        next();
    }
}

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;