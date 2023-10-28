const Listing = require("../models/listing.js");
const mbxGeo = require("@mapbox/mapbox-sdk/services/geocoding-v6.js");
const client = mbxGeo({accessToken: process.env.MAP_TOKEN});

module.exports.index = async (req, res) => {
    const data = await Listing.find();
    res.render("index.ejs", {data});
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    if (!data){
        req.flash("error", "Listing you are trying to access Does Not Exist!");
        res.redirect("/listings");
    } else {
        let previewUrl = data.image.url.replace("uploads", "uploads/c_fill,h_300,w_250");
        res.render("Update.ejs", {data, previewUrl});
    }
}

module.exports.updateListing = async (req, res) => {
    const {id} = req.params;
    let data = req.body;
    data.owner = req.user._id;

    const response = await client.forwardGeocode({
        query: data.location,
        limit: 2,
    }).send()

    data.geometry = response.body.features[0].geometry;

    if(typeof req.file != "undefined"){
        data.image = {url: req.file.path, filename: req.file.filename};
    }
    const updated =  await Listing.findByIdAndUpdate(id, data,{new: true})
    if (!updated){
        req.flash("error", "Listing you are trying to Update Does Not Exist!");
        res.redirect("/listings");
    } else {
        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);
    }
}

module.exports.filter = async (req, res) => {
    const {f} = req.params;
    const data = await Listing.find({type: {$in : [f]}});
    res.render("index.ejs", {data});
}

module.exports.renderNewListingForm =  (req, res) => {
    res.render("add.ejs");
}

module.exports.addNewListing = async (req, res) => {

    let data = req.body;
    data.owner = req.user._id;
    data.image = {url: req.file.path, filename: req.file.filename};

    const response = await client.forwardGeocode({
        query: data.location,
        limit: 2,
    }).send()

    data.geometry = response.body.features[0].geometry;

    let listing = new Listing(data);
    await listing.save()
    req.flash("success", "New Listing Added Successfully!");
    res.redirect("/listings");
    
}

module.exports.showListings = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if (!listing){
        req.flash("error", "Listing you are trying to access Does Not Exist!");
        res.redirect("/listings");
    } else {
        res.render("listing.ejs", {listing});
    }
}

module.exports.destroyListing =  async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findByIdAndDelete(id)
    if (!data){
        req.flash("error", "Listing you are trying to Delete Does Not Exist!");
        res.redirect("/listings");
    } else {
        req.flash("success", "Listing Deleted Successfully!");
        res.redirect("/listings")
    }
}

