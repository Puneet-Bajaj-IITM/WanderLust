const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/510019534/photo/perfect-skin-close-up-of-an-attractive-girl.webp?s=2048x2048&w=is&k=20&c=b6lRzjRXGCN3sZQ8SU3O-qDnWEgmnnOYbcaXGHSZ7G0=",
        set: (v) => v === "" ? "https://media.istockphoto.com/id/510019534/photo/perfect-skin-close-up-of-an-attractive-girl.webp?s=2048x2048&w=is&k=20&c=b6lRzjRXGCN3sZQ8SU3O-qDnWEgmnnOYbcaXGHSZ7G0=" : v,
    },
    price: {
        type: Number,
        default: 0,
        set: (v) => v==="" ? 0 : v,
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing