const Listing = require('../model/Listing');
const Picture = require('../model/Picture');
const ReviewModel = require('../model/Review');
const userControllers = require('../controllers/userControllers');
const Review = ReviewModel.Review;
const Register = Picture.Register;
const Picture_Listing = Picture.Picture_Listing;

exports.getProfileByEmail = async (email) => {
    try {
        return Review.getUserbyEmail(email);
    }
    catch (err) {
        console.log(err);
    }
}

exports.getAllListings = async (req, res, next) => {
    try {
        const [listing, _] = await Listing.findAll();

        res.status(200).json({ count: listing.length, listing });
    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.createNewListing = async (req, res, next) => {
    if(!req.session.admin) {
        req.flash('error','You must be logged in to create a listing');
        res.render(`loginpage`,{error:req.flash('error')});
    }
    let count = await Listing.checkEmail(req.session.email);
    let userId = count[0][0].reg_user_id;
    let landlord_id = userId;
    let { street_num, street_name, city, state, zipcode, description, bed, bath, price } = req.body;
    try {
        let { filename, path } = req.file;
        // let { landlord_id, street_num, street_name, city, state, zipcode, description, bed, bath, price, file_name, rating } = req.params;
        // let listing = new Listing(landlord_id, street_num, street_name, city, state, zipcode, description, bed, bath, price, file_name, rating);

        // listing = await listing.save();

        //TODO: modify to match db
        // let fileUploaded = req.file.path;
        // let fileAsThumbnail = `thumbnail-${req.file.filename}`;
        // let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
        let listing = new Listing(landlord_id, street_num, street_name, city, state, zipcode, description, bed, bath, price);

        listing = await listing.save();
        let pic = new Register(filename, path);
        pic = await pic.save();
        let getListingId = await Listing.getListingId(userId, street_num, street_name, zipcode);
        let listingId = getListingId[0][0].listing_id;
        let getPicId = await Picture_Listing.getPic(filename);
        let picId = getPicId[0][0].picture_id;
        console.log(picId);
        console.log(listingId);
        let picList = new Picture_Listing(picId, listingId);
        picList = await picList.save();
        //res.status(200).json({ message: "Posted" });
        //redirect
        req.flash('success', 'Listing was successfully created');
        res.redirect(`/users/profilePage/${landlord_id}`);
    } catch (error) {
        req.flash('error','Listing was unable to be created. Please try again');
        userControllers.getHomePage(req, res, next);
        // if (req.session.admin) {
        //     res.locals.logged = true;
        //     let result = await Review.getUserbyEmail(req.session.email);
        //     result = result[0][0].reg_user_id;
        //     res.locals.profileId = result;
        //     res.render(`main`,{error:req.flash('error')});
        // } else {
        //     res.render(`main`,{error:req.flash('error')});
        // }
    }
}

exports.createReview = async (req, res, next) => {
    let { rating, title, description, listingId } = req.body;
    try {
        console.log("REQ.BODY: "+JSON.stringify(req.body));
        console.log("Session "+req.session.admin);
        if(!req.session.admin) {
            //user must be logged in
            req.flash('error','You must be logged in to post a review');
            res.render(`loginpage`, {error: req.flash('error')});
        } else {
            let reg_user_id = await Review.getUserbyEmail(req.session.email);
            reg_user_id = reg_user_id[0];
            reg_user_id = reg_user_id[0].reg_user_id;
            //validation
            //check if has required fields
            let review = new Review(reg_user_id, rating, title, description, "listing", listingId);
            console.log("REVIEW: "+JSON.stringify(review));
            review = await review.save();
            // res.status(201).json({ message: "Review created " });
            res.redirect(`/listings/${listingId}`);
        }
    }
    catch(error) {
        req.flash('error','Your review was unable to be posted. Please try again');
        userControllers.getHomePage(req, res, next);
        // if (req.session.admin) {
        //     res.locals.logged = true;
        //     let result = await Review.getUserbyEmail(req.session.email);
        //     result = result[0][0].reg_user_id;
        //     res.locals.profileId = result;
        //     res.render(`main`,{error:req.flash('error')});
        // } else {
        //     res.render(`main`,{error:req.flash('error')});
        // }
    }

}

exports.getListing = async (req, res, next) => {
    try {
        let id = req.params.id;
        console.log("ID: "+id);
        let listing = await Listing.getListingById(id);
        console.log("controllers listing: "+JSON.stringify(listing));
        if(listing.pictures.length <= 0) {
            listing.pictures[0] = {};
            listing.pictures[0].imgPath = 'public/images/listings/images.png';
        }
        res.locals.listing = listing;
        if (req.session.admin) {
            res.locals.logged = true;
            let result = await Review.getUserbyEmail(req.session.email);
            result = result[0][0].reg_user_id;
            res.locals.profileId = result;
        }
        console.log("controllers: "+JSON.stringify(listing));
        res.render("listingPage", { title: "EZRent Listing", style: "listingPage" });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

//TODO
/*  search algorithm
    check empty search
    if address format
        split address
        if listing appears set first listing
    split search
    12345 abc st sf ca 94588
    12345
    if one item
        if number
            if 5 digits
                search zip code OR st#
            else search st#
        else
            if 2 letters
                get city or state from map
                search city OR state
            else
                search street OR city OR state
                search street
 */
exports.searchListings = async (req, res, next) => {
    let search = req.query.search;
    res.locals.searchTerm = search;
    let filters = {
        min: req.query.min,
        max: req.query.max,
        beds: req.query.beds,
        baths: req.query.baths,
        rating: req.query.rating
    };
    console.log("filters: " + JSON.stringify(filters));
    console.log(search);
    if (!search) {
        res.locals.error = "No search term given";
        res.render('error', { title: "EZRent " });
    } else {
        try {
            let results = await Listing.search(search, filters);
            console.log("search controller: " + results.results);
            if (!results.results) {
                console.log("no results");
            }
            res.locals.results = results.results;
            res.locals.message = results.message;
            res.locals.filters = filters;
            if (req.session.admin) {
                res.locals.logged = true;
                let result = await Review.getUserbyEmail(req.session.email);
                result = result[0][0].reg_user_id;
                res.locals.profileId = result;
            }
            res.render('listingResults', { title: "EZRent " + search, header: "Results" });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}