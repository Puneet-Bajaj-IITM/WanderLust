const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const { array } = require("joi");

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String,
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
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: [String],
        enum: ["Trending", "Arctic", "Amazing-pools","Farms", "Amazing-views", "surfing", "Islands", "Lakefront","Beachfront", "Rooms", "Cabins",'OMG!',"Tiny-homes", "Countryside" ],
    },
    geometry: {
        type:{
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates:{
            type: [Number],
            default: [70, 70],
            required: true,
        },
    },
});

//----Deleting reviews after listing deletion ------//

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing