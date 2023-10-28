const { model } = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js")
const wrapAsync = require("./utilsw/wrapAsync.js");
const ExpressError = require("./utilsw/error.js");
const {validateListingSchema, validateReviewSchema} = require("./validateSchema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl 
        req.flash("error", 'Please Login to Access this feature !');
        res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    } else{
        res.locals.redirectUrl = "/listings"
    }
    next()
}

module.exports.isOwner = wrapAsync( async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!(res.locals.curUser && listing.owner.equals(res.locals.curUser._id))){
        req.flash("error", "You are not authorized to access this feature");
        return res.redirect(`/listings/${id}`)
    }
    next()
})

module.exports.validateListing =  (req, res, next) => {
    let {error} = validateListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(er => er.message).join(",");  
        errMsg = errMsg     
        throw new ExpressError(400, errMsg)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    let {error} = validateReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(er => er.message).join(",");        
        throw new ExpressError(400, errMsg)
    }
    next();
}

module.exports.isReviewAuthor = wrapAsync( async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!(res.locals.curUser && review.author.equals(res.locals.curUser._id))){
        req.flash("error", "You are not authorized to access this feature");
        return res.redirect(`/listings/${id}`)
    }
    next()
})