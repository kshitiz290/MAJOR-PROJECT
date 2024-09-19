const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isOwner,isLoggedIn} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const { listingschema } = require("../schema.js");
const upload = multer({ storage })
const ExpressErorr = require("../utils/ExpressError.js");

const validateListing = (req,res,next) =>{
    const {error} = listingschema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressErorr(400,errorMsg);
    }else{
        next();
    }
}

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync((listingController.createListing)))

//Create Route
router.get("/new",isLoggedIn,listingController.renderNewForm)

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateForm))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete))

module.exports = router;