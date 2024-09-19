const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(req.params.id);
    let review = new Reviews(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash("success","Review Created!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewid} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Reviews.findByIdAndDelete(reviewid);

    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}