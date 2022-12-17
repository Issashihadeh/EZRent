const ReviewModel = require('../model/Review');
const Review = ReviewModel.Review;
const routesProtectors = {};

const getProfileByEmail = async (email) => {
    try {
        return Review.getUserbyEmail(email);
    }
    catch (err) {
        console.log(err);
    }
}

routesProtectors.userIsLoggedIn = async function(req, res, next) {
    if(req.session.admin) {
        console.log("user is logged in");
        res.locals.logged = true;
        await getProfileByEmail(req.session.email)
        .then(id => {
            res.locals.profileId = id[0][0].reg_user_id;
        });
        next();
    } else {
        // errorPrint("user is not logged in");
        // req.flash('error', 'You must be logged in to create a post');
        // res.redirect('users/login');
        next();
    }
}

module.exports = routesProtectors;