const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addReview = async (req, res) => {
    let {id} = req.params;    
    let review = new Review(req.body)
    review.author = req.user._id;
    review.save();

    review = await Review.findOne(review).populate("author");
    let listing = await Listing.findById(id);

    listing.reviews.push(review);
    const result = await Listing.findByIdAndUpdate(id, listing, {updated: true})
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId } = req.params;
    await Listing.findByIdAndUpdate( id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}