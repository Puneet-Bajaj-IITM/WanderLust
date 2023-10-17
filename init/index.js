const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const {data} = require("./data.js");

main()
    .then(res => console.log("connected to database"))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const init = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("data was saved");
}

init();