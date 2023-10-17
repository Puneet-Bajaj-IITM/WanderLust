const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilsw/wrapAsync.js");
const ExpressError = require("../utilsw/error.js");
const {listingSchema} = require("../schema.js");


const validateListing =  (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(er => er.message).join(",");        
        throw new ExpressError(400, errMsg)
    }
    next();
}

//---Listings----//

//Home page or index route
router.get("/", wrapAsync(async (req, res) => {
    const data = await Listing.find();
    res.render("index.ejs", {data});
}));

//Edit and update route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    if (!data){
        req.flash("error", "Listing you are trying to access Does Not Exist!");
        res.redirect("/listings");
    } else {
        res.render("Update.ejs", {data});
    }
}))

router.put("/:id", validateListing, (req, res) => {
    let {id} = req.params;
    const data = Listing.findByIdAndUpdate(id, req.body,{new: true})
    if (!data){
        req.flash("error", "Listing you are trying to Update Does Not Exist!");
        res.redirect("/listings");
    } else {
        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);
    }
})

//Add a new listing
router.get("/new", (req, res) => {
    console.log("reached");
    res.render("add.ejs");
})


router.post("/", validateListing,  wrapAsync(async (req, res) => {
    let data = req.body;
    let listing = new Listing(data);
    await listing.save()
    req.flash("success", "New Listing Added Successfully!");
    res.redirect("/listings");
    
}))

//Show route for each listing
router.get("/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing){
        req.flash("error", "Listing you are trying to access Does Not Exist!");
        res.redirect("/listings");
    } else {
        res.render("listing.ejs", {listing});
    }
}))

//Destroy route
router.delete("/:id", wrapAsync( async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findByIdAndDelete(id)
    if (!data){
        req.flash("error", "Listing you are trying to Delete Does Not Exist!");
        res.redirect("/listings");
    } else {
        req.flash("success", "Listing Deleted Successfully!");
        res.redirect("/listings")
    }
}));

module.exports = router;