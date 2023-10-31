const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let {data} = require("./data.js");
const dbUrl = process.env.ATLAS_URL;

main()
    .then(res => console.log("connected to database"))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://localhost:27017");
}

const init = async () => {
    await Listing.deleteMany({});
    data = data.map((obj) => ({...obj, owner: "653237f9976d1bb9505d426c"}))
    data = data.map((obj) => ({...obj, geometry:{type: "Point"}}))
    for (const obj of data) {
        let img = obj.image;
        obj.image = {
            url: img,
            filename: "initailFile",
        }
    }
    console.log(data);
    await Listing.insertMany(data);
    console.log("data was saved");

}

init();