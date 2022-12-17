/* 

Primarily for M4
This file is used as a guide for the frontend and
backend to communicate with each other.

For each GET and POST api, frontend may pass data
to the backend

For each GET and POST api, backend may send a
response to the frontend

These data packages will be sent in the form of
json objects

For each api, please specify here how the data should
be represented using exact variable names and
structure

These data items will be processed in their
respective contollers.js files

*/

/* From frontend to backend */
//search
let search = {
    "search-term": "", //search term is being taken care of by Tung
    "filters": { 
        "beds": "",
        "baths": "",
        "min-price": "",
        "max-price": "",
        "rating": ""
    },
    "sort": {
        "price":"",
        "rating":"",
        "time-posted":"",
        "number-of-reviews":""
    }
};

//login TODO M3
let login = {
    "email":"",
    "password":""
}
//get from database: TODO in M4
let sessionInfo = {
    "reg_user_id":""
}

/* From backend to frontend */
//homepage
//listingControllers.getFeaturedListings
//needs 3 listings with the best ratings packaged like this
let listings = {
    "listing1": {
        "landlord": "Bob John",
        "price": "40,000",
        "description": "Basically a resort",
        "street_number": "1234",
        "street": "Fall Street",
        "city": "Stockton",
        "state": "CA",
        "zip": "94545",
        "rooms": 2,
        "baths": 1,
        "top_review": {
            "title": "Love it",
            "rating": 5,
            "author": "Staniel Chaniel",
            "description": "Love this place"
        }
    },
    "listing2": {
        "landlord": "John Bob",
        "price": "12,000",
        "description": "Cool place",
        "street_number": "1234",
        "street": "Span Avenue",
        "city": "Hayward",
        "state": "CA",
        "zip": "94545",
        "rooms": 4,
        "baths": 3,
        "top_review": {
            "title": "Beautiful",
            "rating": 5,
            "author": "Dennis Dennis",
            "description": "There's a nice view"
        }
    },
    "listing3": {
        "landlord": "Job Bohn",
        "price": "50,000",
        "description": "Perfect for family",
        "street_number": "1234",
        "street": "Ballast Court",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94545",
        "rooms": 4,
        "baths": 2,
        "top_review": {
            "title": "Wowow",
            "rating": 4,
            "author": "Alonzo Aball",
            "description": "My family loves this place"
        }
    }
};
//userControllers.getFeaturedLandlords
//needs 3 landlords with the best ratings packaged like this
let landlords = {
    "landlord1": {
        "name": "Bob John",
        "rating": 5,
        "bio": "I own multiple houses in the city. I've been faithfully serving tenants for 30 years."
    },
    "landlord2": {
        "name": "John Bob",
        "rating": 5,
        "bio": "I own a condo downtown. I would love to meet you."
    },
    "landlord3": {
        "name": "Job Bohn",
        "rating": 5,
        "bio": "I let my reviews speak for themselves."
    }
};
//reviewControllers.getBadReview
//needs 1 review with a 2 star rating or less with lots of upvotes
let badReview = {
    "rating": 2,
    "title": "Horrendous. No compassion",
    "description": `I have a sick mother. This landlord raised my rent 3 times in the last 14 months because of the "economy".`
}
//listingControllers.searchListings
