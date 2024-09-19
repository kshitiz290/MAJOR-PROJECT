const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to Edit Listing!");
        return res.redirect("/login");
       }
       next();
}
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing !");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review !");
        return res.redirect(`/listings/${id}`)
    }
    next();
}