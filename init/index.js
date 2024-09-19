const mongoose = require("mongoose");
const Listing= require("../models/listing.js");
const initdata = require("./data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{console.log("connected to db")})
.catch((err)=>{console.log(err)});

async function initdb() {
await Listing.deleteMany({});
initdata.data = initdata.data.map((obj=>({...obj,owner : "66d0afa59fe857b9a1033ec0"})))
await Listing.insertMany(initdata.data);
console.log("data initialized");
}

initdb();