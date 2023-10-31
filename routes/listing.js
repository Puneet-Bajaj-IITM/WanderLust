const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utilsw/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({storage});

//---Listings----//

router
    .route("/")
    .get( wrapAsync(listingController.index)) //Home page or index route
    .post( isLoggedIn, upload.single("image"), validateListing, wrapAsync(listingController.addNewListing)) //Adding a new Listing
    

router.get("/:id/edit", isLoggedIn , isOwner, wrapAsync(listingController.renderEditForm)) //Edit form route

router.get("/new", isLoggedIn, listingController.renderNewListingForm) //Render form to add a new Listing

router.get("/filter/:f", listingController.filter); //Apply a filter

router.get("/search", async (req, res) => {
    let {q} = req.query;
    let d1 = await Listing.find({location: q})
    d2 = await Listing.find({title: q})
    d3 = await Listing.find({country: q})
    let data = [...d1,...d2,...d3]
    console.log(data)
    if(!data){
        req.flash("error", "OOPs! No results,  Try searching a different field");
        res.redirect("/listings");
    }else{
        console.log(data);
        res.render("index.ejs", {data:data})
    }


})

router
    .route("/:id")
    .get( wrapAsync(listingController.showListings)) //Show route for each listing
    .put( isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updateListing)) //Updation after editing
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) //Destroy route

module.exports = router;