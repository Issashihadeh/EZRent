const express = require('express');
const listingControllers = require('../controllers/listingControllers');
var isLoggedIn = require('../middleware/routesprotectors').userIsLoggedIn;
const multer = require('multer');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/listings');
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
        //return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage: storage
});
/*
router.route("/").get(listingControllers.getAllUsers).post(upload.single('picture'),listingControllers.createNewUser, (req, res, next) => {
    console.log(req);
    res.send('');
});
*/


router.route("/").post( upload.single('pic'), listingControllers.createNewListing);

router.get("/search", isLoggedIn, listingControllers.searchListings, async (req, res, next) => {
    console.log("/search");
    res.render("listingResults");
});

router.get("/:id", isLoggedIn, listingControllers.getListing, async (req, res, next) => {
    console.log("/:id");
    res.render("listingPage", { title: "EZRent Listing", style: "listingPage" });
});

router.route("/review").post(listingControllers.createReview);


module.exports = router;