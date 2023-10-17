const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilsw/wrapAsync.js");
const ExpressError = require("../utilsw/error.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(er => er.message).join(",");        
        throw new ExpressError(400, errMsg)
    }
    next();
}

//---reviews-----//

//Add a review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;    
    let review = new Review(req.body)
    review.save();

    review = await Review.findOne(review)
    let listing = await Listing.findById(id);

    listing.reviews.push(review);
    const result = await Listing.findByIdAndUpdate(id, listing, {updated: true})
    console.log(result);
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/listings/${id}`)
}));

//Delete a review
router.delete("/:reviewId", wrapAsync( async (req, res) => {
    let {id, reviewId } = req.params;
    await Listing.findByIdAndUpdate( id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;