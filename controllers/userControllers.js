const User = require('../model/User');
const ReviewModel = require('../model/Review');
const Listing = require('../model/Listing');
var sessions = require('express-session');
const Picture = require('../model/Picture');
const Register = User.Register;
const UpdateWithPic = User.UpdateWithPic;
const UpdateWithPicNoBio = User.UpdateWithPicNoBio;
const UpdateBio = User.UpdateBio;
const Review = ReviewModel.Review;
const Rating = User.Rating;
const Landlord = User.Landlord;
const RegisteredUser = User.RegisteredUser;
const Picture_Profile = Picture.Picture_Profile;
const bcrypt = require("bcrypt");
var validator = require("email-validator");
var geoip = require('geoip-lite');
const e = require('express');


// exports.getAllUsers =  async  (req, res, next ) => {
//     try {
//         const [registeredUser, _] = await Register.getAll();

//         res.status(200).json({count: registeredUser.length, registeredUser}); 
//     } catch (error) {
//         console.log(error);
//         next(error);  
//     }
// }

// const checkUsername = (username) => {

//     let usernameChecker = /^\D\w{2,}$/;
//     return usernameChecker.test(username);
// }

const checkPassword = (password) => {
    let passwordChecker = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordChecker.test(password);
}

// const checkEmail = (email) => {
//         let emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//         return emailChecker.test(email);
// }

const emailValidator = (email) =>{
    let emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailChecker.test(email);
}
exports.createUser = async (req, res, next) => {
    try {
        console.log("REGISTER");
        let { firstName, lastName, password, email, confirmPassword, role } = req.body;
        const hashpassword = bcrypt.hashSync(password, 10);
        if (role != "landlord") {
            role = 'renter';
        }
        let register = new Register(firstName, lastName, hashpassword, email, role);
        let count = await Register.checkEmail(email);

        if (count[0] != 0) {
            req.flash("error", 'Email already exist');

            res.render("registration", { error: req.flash('error') });
        }
        else if (!validator.validate(email)) {
            req.flash("error", 'Incorrect Email format');
            
            res.render("registration", {error: req.flash('error')});
        } else if (confirmPassword != password ) {
            req.flash("error", 'password does not match');
            
            res.render("registration", {error: req.flash('error')});
        }
        else if (!checkPassword(password)){
            req.flash("error", 'Password does not meet requirments!');
            
            res.render("registration", {error: req.flash('error')});
        }
        else {
            register = await register.save();
            req.flash("success", 'Account registered !');

            res.render("loginpage", {success: req.flash('success')});
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

exports.postReview = async (req, res, next) => {
    try {
        let { rating, title, description, type, landlordId } = req.body;
        console.log("review body: " + JSON.stringify(req.body));
        let count = await Listing.checkEmail(req.session.email);
        let userId = count[0][0].reg_user_id;

        let review = new Review(userId, rating, title, description, type, landlordId);
        review.save();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getProfileByEmail = async (email) => {
    try {
        return Review.getUserbyEmail(email);
    }
    catch (err) {
        console.log(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        let { password, email } = req.body;
        let count = await Register.checkEmail(email);
        if (count[0].length == 0) {
            req.flash("error", 'email is not registered');
            res.render("loginpage", {error: req.flash('error')});
            
        }
        else {
            const hashedpassword = await Register.getPassword(email);
            const temp = hashedpassword[0];
            const newHashedPassword = temp[0].password;
            //console.log(req.session);
            if (await bcrypt.compare(password, newHashedPassword)) {
                if (req.session.admin && req.session.email == email) {
                    console.log(req.session);
                    console.log("User already logged in");
                    res.redirect('/');
                }
                else {

                    req.session.email = email;
                    req.session.admin = true;
                    console.log(req.session);
                    console.log("---------> Login Successful");
                   
                    res.redirect('/');
                }
                
            }
            else {
                req.flash("error", "Password is incorrect!")
                res.render("loginpage", {error: req.flash('error')});
            }
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

exports.logout = async (req, res, next) => {
    req.session.destroy();
    console.log("---------> Successfully Logout");
    next(error);
    res.redirect('/');
}

exports.update = async (req, res, next) => {
    try {
        
        let bio = req.body;
        bio = bio.bio;
        let user = await Register.getUserbyEmail(req.session.email);
        let id = user[0][0].reg_user_id;
        if(req.file != undefined && bio.length != 0)
        {
            let { filename, path } = req.file;
            let pic = new Picture_Profile(filename, path);
            pic = await pic.save();
            let picture_profile_fk = await Picture_Profile.getPicId(filename, path);
            picture_profile_fk = picture_profile_fk[0][0].picture_id;
            let update = new UpdateWithPic(picture_profile_fk, bio, id);
            update = await update.update();
        }
        else if(bio.length == 0)
        {
            let { filename, path } = req.file;
            let pic = new Picture_Profile(filename, path);
            pic = await pic.save();
            let picture_profile_fk = await Picture_Profile.getPicId(filename, path);
            picture_profile_fk = picture_profile_fk[0][0].picture_id;
            let update = new UpdateWithPicNoBio(picture_profile_fk, id);
            update = await update.update();
        }
        else{
            let update = new UpdateBio(bio, id);
            update = await update.update();
        }

            res.redirect(`../users/profilePage/${id}`);
    }
    catch (error) {
        next(error);
    }
}

exports.createReview = async (req, res, next) => {
    try {
        let { rating, title, description, type, landlordId } = req.body;
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
            let review = new Review(reg_user_id, rating, title, description, type, landlordId);
            console.log("REVIEW: "+JSON.stringify(review));
            review = await review.save();
            // res.status(201).json({ message: "Review created " });
            res.redirect(`/users/profilePage/${landlordId}`);
        }
    }
    catch (error) {
        next(error);
    }

}

exports.getUserProfile = async (req, res, next) => {
    try {
        let id = req.params.id;
        console.log("ID: "+id);

        let profile = await RegisteredUser.getRegisteredUser(id);
        console.log("profile controllers: " + JSON.stringify(profile));
        if(profile.user.profilePic == null) {
            profile.user.profilePic = 'public/images/profile/default.jpeg';
        }
        res.locals.profile = profile;
        if (profile.user.role == 'landlord') {
            if (req.session.admin) {
                res.locals.logged = true;
                let result = await Review.getUserbyEmail(req.session.email);
                result = result[0][0].reg_user_id;
                res.locals.profileId = result;
                if (result == id) {
                    res.render("profilePage", { title: "EZRent" });
                } else {
                    res.render("publicLandlordProfilePage", { title: "EZRent" });
                }
            } else {
                res.render("publicLandlordProfilePage", { title: "EZRent" });
            }
        } else {
            if (req.session.admin) {
                res.locals.logged = true;
                let result = await Review.getUserbyEmail(req.session.email);
                result = result[0][0].reg_user_id;
                res.locals.profileId = result;
                res.render("userProfilePage", { title: "EZRent"});
            } else {
                res.render("main", { title: "EZRent", style: "main" });
            }
            //not allowed
        }
    }

    catch (error) {
        console.log(error);
    }
}


exports.getLandlordList = async (req, res, next) => {
    try {
        let name = req.params.name;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let LandlordList = await Review.getLanlordList(name);
        LandlordList = LandlordList[0];
        res.status(200).json({ LandlordList });
    }
    catch (error) {
        next(error);
    }
}

exports.getFeaturedLandlords = async (req, res, next) => {
    try {
        // let ip = req.ip;
        // var geo = geoip.lookup(ip);
        // let city = geo.city;
        let city = 'San Francisco';
        let landlords = await Landlord.getFeaturedLandlords(city);
        landlords = landlords[0];
        for(let landlord of landlords) {
            if(landlord.profilePicture == null) {
                landlord.profilePicture = '/public/images/profile/default.jpeg';
            }
        }
        console.log("controllers: " + landlords);
        return landlords;
    }
    catch (error) {
        console.log(error);
    }
}

exports.getBadReview = async (req, res, next) => {
    try {
        //TODO await Landlord.getFeaturedLandlords();
        // mment out when implement Model
        let review = await Review.getBadReview();
        review = review[0][0];
        console.log("reviews controllers: " + review);
        return review;
    }
    catch (error) {
        console.log(error);
    }
}
// exports.register = async (req, res, next) => {
//     try {
//         //parse json
//         let { name, email, password } = req.body;
//         // hash password
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         //TODO server-side validation here
//         if (!checkUsername(username)) {
//             req.flash('error', "invalid username!!!");
//             req.session.save(err => {
//                 res.redirect("/registration");
//             });
//         } else if (!checkEmail(email)) {
//             req.flash('error', "invalid Email!!!");
//             req.session.save(err => {
//                 res.redirect("/registration");
//             });

//         } else if (!checkPassword(password)) {
//             req.flash('error', "Password must be at least8 characters long, contains Upper and lower case characters, and a special character");
//             req.session.save(err => {
//                 res.redirect("/registration");
//             })

//         } else if (password != cpassword) {
//             req.flash('error', "password did not match");
//             req.session.save(err => {
//                 res.redirect("/registration");
//             });
//         } else {
//             next();
//         }

//         register = await User.register(name, email, password);

//         res.status(201).json({ message: "User created " });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }

exports.searchLandlords = async (req, res, next) => {
    console.log("search landlords");
    let search = req.query.search;
    res.locals.searchTerm = search;
    if (!search) {
        res.locals.error = "No search term given";
        // res.render('error', { title: "EZRent " });
    } else {
        try {
            let results = await Landlord.search(search);
            if (results) {
                res.locals.results = results;
                res.render('landlordResults', { title: "EZRent " + search, header: "Results" });
            } else {
                console.log("no results");
                res.render('landlordResults', { title: "EZRent " + search, header: "Results" });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}