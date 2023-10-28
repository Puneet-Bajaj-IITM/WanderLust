const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utilsw/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controller/review.js");

//---reviews-----//

router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.addReview)) //Add a review

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview)) //Delete a review

module.exports = router;