const db = require('../database/db');
// const UserModel = {};

// /**TODO
//  * takes in a string
//  * hashes
//  * returns hash value
//  */
// function encrypt(password) {
//     return password; //delete this line of code
//     //return encryptedPassword;
// }

// /**
//  * takes in a string and a hash value
//  * hashes string
//  * returns true if hash values are the same
//  * returns false if the hash values are different
//  */
// function compare(password, hash) {
//     return (encrypt(password) == hash);
// }

// UserModel.verifyPassword = (id, password) => {
//     let sql = "SELECT password FROM registeredUser WHERE reg_user_id=?;";
//     return db.execute(sql, [id])
//     .then(([results, fields]) => {
//         if(results && results.length == 1) {    //check database returned anything
//             id = results[0].id;                 //get the user id from the results
//             return compare(password, results[0].password);
//         } else {
//             return Promise.reject(-1);          //rejects if not exactly one result
//         }
//     })
//     .then((passwordsMatched) => {
//         if(passwordsMatched) {
//             return Promise.resolve(id);
//         } else {
//             return Promise.resolve(-1);
//         }
//     })
//     .catch((err) => Promise.reject(err));
// }

// UserModel.register = (name, email, password) => {
//     //set date to current date
//     let d = new Date();
//     let yyyy = d.getFullYear();
//     let mm = d.getMonth() + 1 ;
//     let dd = d.getDay();

//     let createdAtDate = `${yyyy}-${mm}-${dd }`; 

//     //encrypt password for security
//     let encryptedPassword = encrypt(password);

//     let sql = `
//         INSERT INTO registeredUser(
//             name,
//             email,
//             password,
//             created_at
//         )
//         VALUES (?, ?, ?, ?)
//         `;

//     //execute with security measures
//     return db.execute(sql, [
//         name,
//         email,
//         encryptedPassword,
//         createdAtDate
//     ]);
// }

// UserModel.emailExists = (email) => {            //check if email exists in database
//     return db.execute("SELECT * FROM users WHERE email=?", [email])
//     .then(([results, fields]) => {
//         return Promise.resolve(!(results && results.length == 0));
//     })
//     .catch((err) => Promise.reject(err));
// }

// UserModel.authenticate = (email, password) => {
//     let sql = "SELECT reg_user_id, email, password FROM registeredUser WHERE email=?;";
//     let userId;
//     return db.execute(sql, [email])
//     .then(([results, fields]) => {
//         if(results && results.length == 1) {    //check database returned anything
//             userId = results[0].id;             //get the user id from the results
//             return compare(password, results[0].password);
//         } else {
//             return Promise.reject(-1);          //rejects if not exactly one result
//         }
//     })
//     .then((passwordsMatched) => {
//         if(passwordsMatched) {
//             return Promise.resolve(userId);
//         } else {
//             return Promise.resolve(-1);
//         }
//     })
//     .catch((err) => Promise.reject(err));
// }

// //get reg_user_id and add it to landlord table
// //TODO update registeredUser table to set role to landlord
// UserModel.registerLandlord = (id) => {
//     let sql = `
//         INSERT INTO landlord (landlord_id)
//         VALUES (?)
//     `;

//     return db.execute(sql, [id]);
// }

// //TODO Get top three landlords by rating
// UserModel.getFeaturedLandlords = () => {
//     //get all landlords
//     //sort them
//     //get only 3
//     let sql = `
//         SELECT * FROM landlord;
//     `;

//     //return db.execute(sql);
// }

// //TODO Get landlords that match search
// UserModel.getLandlordsBySearch = (search, filters) => {
//     //get landlords that match
//     //apply filters
//     //sort them
//     let sql = `
//         SELECT * FROM registeredUser
//     `;

//     return db.execute(sql);
// }

// module.exports = UserModel;

class RegisteredUser {
    constructor(firstName, lastName, password, email, role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    static async getRegisteredUser(id) {
        let profile = {};
        let userSQL = `SELECT reg_user_id AS 'id', first_name AS 'firstName', last_name AS 'lastName', email, phone, bio, role, img_path AS 'profilePic'
            FROM RegisteredUser
            LEFT JOIN Picture
            ON RegisteredUser.profile_picture_fk = Picture.picture_id
            WHERE reg_user_id = ${id};`
        await db.execute(userSQL).then(result => {
            profile.user = result[0][0];
        });
        console.log("profile model 1: "+JSON.stringify(profile));
        if(profile.user.role == 'renter') {
            let reviewsSQL = `SELECT review_id AS 'reviewId', author_fk AS 'renterId', author.full_name AS 'renterName',
			    Review.rating, title, Review.description, Review.time_created AS 'timeCreated', Review.type,
                listing_fk AS 'listingId', LandlordReview.landlord_fk AS 'landlordId', city, state,
                subject_landlord.full_name AS 'landlordName', file_name AS 'thumbnail'
			    FROM Review
			    JOIN RegisteredUser author
                ON author.reg_user_id = Review.author_fk
                LEFT JOIN ListingReview
                ON Review.review_id = ListingReview.review_fk
                LEFT JOIN LandlordReview
                ON Review.review_id = LandlordReview.review_fk
                LEFT JOIN Listing
                ON ListingReview.listing_fk = Listing.listing_id
                LEFT JOIN Landlord
                ON LandlordReview.landlord_fk = Landlord.reg_user_fk
                LEFT JOIN RegisteredUser subject_landlord
                ON Landlord.reg_user_fk = subject_landlord.reg_user_id
                LEFT JOIN ReviewPicture
                ON Review.review_id = (SELECT ReviewPicture.review_fk
					FROM ReviewPicture rp
                    WHERE Review.review_id = rp.review_fk
                    ORDER BY rp.review_fk
                    LIMIT 1) 
                LEFT JOIN Picture
                ON ReviewPicture.picture_fk = Picture.picture_id
                WHERE author_fk = ${id};`;
            await db.execute(reviewsSQL).then(result => {
                profile.reviews = result[0];
            });
            console.log("profile model 2: "+JSON.stringify(profile));
        } else if(profile.user.role == 'landlord') {
            let listingsSQL = `SELECT listing_id AS 'listingId', price, description, street_number AS 'streetNumber', street, city, state,
			    address_line_2 AS 'addressLine2', zip_code AS 'zipCode', address, beds, baths, size, pets, type,
                rating, num_reviews AS 'numReviews', time_created AS 'timeCreated', file_name AS 'thumbnail'
			    FROM Listing
                LEFT JOIN ListingPicture
                ON Listing.listing_id = (SELECT ListingPicture.listing_fk
					FROM ListingPicture ls
                    WHERE Listing.listing_id = ls.listing_fk
                    ORDER BY ls.listing_fk
                    LIMIT 1)
                LEFT JOIN Picture
                ON ListingPicture.picture_fk = Picture.picture_id
                WHERE landlord_fk = ${id};`;
            let reviewsSQL = `SELECT review_id AS 'reviewId', rating, title, description, Review.time_created AS 'timeCreated',
			    subject_landlord.reg_user_id AS 'landlordId', author.reg_user_id AS 'renterId',
			    subject_landlord.full_name AS 'landlord', author.full_name AS 'renter',
                file_name AS 'thumbnail'
			    FROM Review
                JOIN RegisteredUser author
                ON Review.author_fk = author.reg_user_id
                JOIN LandlordReview
                ON Review.review_id = LandlordReview.review_fk
                JOIN RegisteredUser subject_landlord
                ON LandlordReview.landlord_fk = subject_landlord.reg_user_id
                LEFT JOIN ReviewPicture
                ON Review.review_id = (SELECT ReviewPicture.review_fk
					FROM ReviewPicture rp
                    WHERE Review.review_id = rp.review_fk
                    ORDER BY rp.review_fk
                    LIMIT 1) 
                LEFT JOIN Picture
                ON ReviewPicture.picture_fk = Picture.picture_id
                WHERE LandlordReview.landlord_fk = ${id};`;
            await db.execute(listingsSQL).then(result => {
                profile.listings = result[0];
            });
            await db.execute(reviewsSQL).then(result => {
                profile.reviews = result[0];
            });
            console.log("profile model 3: "+JSON.stringify(profile));
        }
        return profile;
    }
}

class Register {
    constructor(firstName, lastName, password, email, role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    async save() {
        let d = new Date();
        let yyyy = d.getFullYear();
        let mm = d.getMonth() + 1;
        let dd = d.getDay();
        let hour = d.getHours();
        let min = d.getMinutes();
        let sec = d.getSeconds();

        let createdAtDate = `${yyyy}-${mm}-${dd} ${hour}:${min}:${sec}`;

        let regUserSQL = `
            INSERT INTO RegisteredUser (
                first_name,
                last_name,
                email,
                password,
                role,
                time_created
            )
            VALUE (
                '${this.firstName}',
                '${this.lastName}',
                '${this.email}',
                '${this.password}',
                '${this.role}',
                '${createdAtDate}'
            )`;

        db.execute(regUserSQL);

        if(this.role == 'landlord') {
            let idSQL = `SELECT LAST_INSERT_ID();`
            await db.execute(idSQL).then(async (id) => {
                let landlordSQL = `
                    INSERT INTO Landlord (reg_user_id)
                    VALUE (${id})
                `;
                await db.execute(landlordSQL);
            });
        }

        return 0;

    }
    static getUserbyEmail(email) {
        let sql = `SELECT reg_user_id, role FROM RegisteredUser WHERE email = '${email}';`;
        return db.execute(sql);
    }
    static checkIfProfileWithPic(id){
        let sql = `SELECT * FROM Picture WHERE poster_fk = ${id};`
        return db.execute(sql);
    }
    static checkEmail(email) {
        let sql = `SELECT email FROM RegisteredUser WHERE email = '${email}';`;
        return db.execute(sql);
    }
    static getPassword(email) {
        let sql = `SELECT password FROM RegisteredUser WHERE email = '${email}';`;
        return db.execute(sql);
    }
}

class Landlord {
    constructor(reg_user_id){
        this.reg_user_id = reg_user_id;
    }
    
    save(){
        let sql = `
            INSERT INTO landlord (
                reg_user_id,
            )
            VALUE (
                ${this.reg_user_id},
            )
        `
        return db.execute(sql);
    }

    static getFeaturedLandlords() {
        let sql = `SELECT reg_user_id AS 'landlordId', first_name AS 'firstName', last_name AS 'lastName', bio, rating,
            img_path AS 'profilePicture'
            FROM RegisteredUser
            JOIN Landlord
            ON RegisteredUser.reg_user_id = Landlord.reg_user_fk
            LEFT JOIN Picture
            ON RegisteredUser.profile_picture_fk = Picture.picture_id
            ORDER BY rating DESC
            LIMIT 3;`;
        return db.execute(sql);
    }

    static async search(searchTerm) {
        let results = [];
        let splitSearch = searchTerm.split(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~ ]/);
        for(const searchItem of splitSearch) {
            let sql = `SELECT reg_user_fk AS 'landlordId', rating, full_name AS 'fullName', img_path AS 'profilePicture', bio
                FROM Landlord
                JOIN RegisteredUser
                ON Landlord.reg_user_fk = RegisteredUser.reg_user_id
                LEFT JOIN Picture
                ON RegisteredUser.profile_picture_fk = Picture.picture_id
                WHERE full_name LIKE '%${searchItem}%'
                ORDER BY rating DESC;`;
            results = await db.execute(sql);
            console.log("Model results: "+JSON.stringify(results,null,2));
            results = results[0];
        }
        console.log("Model results: "+JSON.stringify(results,null,2));
        return results;
    }
}

class UpdateWithPic {
    constructor(profile_picture_fk, bio, id) {
        this.profile_picture_fk = profile_picture_fk;
        this.bio = bio;
        this.id = id;
    }

    update() {
        let sql = `
            UPDATE RegisteredUser
            SET 
                profile_picture_fk = ${this.profile_picture_fk},
                bio = '${this.bio}'
            WHERE reg_user_id = ${this.id};`;
        return db.execute(sql);
    }
}



class UpdateWithPicNoBio {
    constructor(profile_picture_fk, id) {
        this.profile_picture_fk = profile_picture_fk;
        this.id = id;
    }

    update() {
        let sql = `
            UPDATE RegisteredUser
            SET 
                profile_picture_fk = ${this.profile_picture_fk}
                WHERE reg_user_id = ${this.id};`;
        return db.execute(sql);
    }
}

class UpdateBio {
    constructor(bio, id) {
        this.bio = bio.replace(`'`,`\\'`);
        this.id = id;
    }

    update() {
        let sql = `
            UPDATE RegisteredUser
            SET 
                bio = '${this.bio}'
            WHERE reg_user_id = ${this.id};`;
        return db.execute(sql);
    }
}

class Review {
    constructor(reg_user_id, rating, description, referLandlordId) {
        this.reg_user_id = reg_user_id;
        this.rating = rating;
        this.description = description;
        this.referLandlordId = referLandlordId;
    }

    save() {
        let sql = `
            INSERT INTO review (reg_user_id, rating, description, referLandlordId)
            VALUE(
                ${this.reg_user_id},
                ${this.rating},
                '${this.description}',
                ${this.referLandlordId}
        );`;
        return db.execute(sql);
    }

    static getUserbyEmail(email) {
        let sql = `SELECT reg_user_id FROM registeredUser WHERE email = '${email}';`;
        return db.execute(sql);
    }
    static getUserbyId(id) {
        let sql = `SELECT reg_user_id FROM registeredUser WHERE reg_user_id = ${id};`;
        return db.execute(sql);
    }
    static getRole(id){
        let sql = `SELECT role FROM registeredUser WHERE reg_user_id = ${id};`;
        return db.execute(sql);
    }
    static getLandlordProfile(id){
        let sql = `SELECT firstName, lastName, email, bio, picture, user_rating, role FROM registeredUser WHERE reg_user_id = ${id};`;
        return db.execute(sql);
    }
    static getLandlordRating(id){
        let sql = `SELECT rating FROM review LEFT OUTER JOIN registeredUser ON review.referLandlordId = registeredUser.reg_user_id WHERE review.referLandlordId = ${id} AND registeredUser.role = 'landlord'`;
        return db.execute(sql);
    }
    static getLandlordReview(id){
        let sql = `SELECT registeredUser.firstName, registeredUser.lastName, review.rating, review.description  FROM registeredUser LEFT OUTER JOIN review ON registeredUser.reg_user_id = review.reg_user_id WHERE review.referLandlordId = ${id};`;
        return db.execute(sql);
    }
    static getRenterProfile(id){
        let sql = `SELECT firstName, lastName, email, bio, picture, role FROM registeredUser WHERE reg_user_id = ${id};`;
        return db.execute(sql);
    }
    static getRenterWrittenReview(id){
        let sql = `SELECT registeredUser.firstName, registeredUser.lastName, review.rating, review.description FROM registeredUser LEFT OUTER JOIN review ON registeredUser.reg_user_id = review.referLandlordId WHERE registeredUser.reg_user_id = ${id}`;
        return db.execute(sql);
    }
    static getLanlordList(name){
        let sql = `SELECT firstName, lastName, email FROM registeredUser WHERE registeredUser.firstName = '${name}' OR registeredUser.lastName = '${name}' AND registeredUser.role = 'landlord';`;
        return db.execute(sql);
    }
}

class Rating {
    constructor(reg_user_id, user_rating) {
        this.reg_user_id = reg_user_id;
        this.user_rating = user_rating;
    }
    update_rating() {
        let sql = `
            UPDATE registeredUser
            SET user_rating = ${this.user_rating}
            WHERE reg_user_id = ${this.reg_user_id};  
        `;
        return db.execute(sql);
    }
}
module.exports = { Register, UpdateWithPic, UpdateWithPicNoBio, UpdateBio, Review, Rating, Landlord, RegisteredUser };