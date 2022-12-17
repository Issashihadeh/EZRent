var express = require('express');
var app = express();
var sessions = require('express-session');
var mysqlSession = require ('express-mysql-session')(sessions);
const cookieParser = require("cookie-parser");
var postRouter = require("./controllers/listingControllers");
var flash = require('connect-flash');
var bodyParser=require('body-parser');
const port = 8080;
var bodyParser = require('body-parser')
const path = require('path');
var handlebars = require('express-handlebars');
const exp = require('constants');

app.use(express.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
// parse application/json 
app.use(bodyParser.json())
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Create session
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.set('view engine', 'handlebars');
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use('/', require("./route/routeIndex"));

// Redirect requests to endpoint starting with /registered to registeredRoutes.js
app.use("/users", require("./route/userRoutes"));

// Redirect requests to endpoint starting with /registered to registeredRoutes.js
app.use("/listings", require("./route/listingRoutes"), express.static('public/images/listing'));

app.use(express.static((path.join(__dirname, "js"))));

app.use(express.static('model'));

app.use(flash());

// app.use((req, res, next)=>{
//     app.locals.success = req.flash('error')
//     next();
//   });

// Global Error Handler. Important function params must start with err
app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    res.status(500).json({
        message: "Something went wrong",
    });
})


app.engine('handlebars', handlebars.engine({
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    extname: 'handlebars',
    defaultLayout: 'home',
    helpers: {
        emptyObject: (obj) => { //for flash messages
            return !(obj.constructor === Object && Object.keys(obj).length == 0);
        },
        log: (obj) => {
            console.log(obj);
        },
        for: (times, obj) => {
            var result = '';
            for(var i = 0;i < times;i++) {
                result += obj.fn(i);
            }
            return result;
        },
        listItem: (obj) => {
            return obj+1;
        },
        and: (c1, c2) => {
            return c1 && c2;
        },
        equals: (obj1, obj2, options) => {
            if(obj1 == obj2) return options.fn(this);
            else return options.inverse(this);
        }
        /**
         * if you need more helpers, add them here
         * key, value
         * value is a function
         */
    }
}));

app.use(express.static('views'));

app.use("/public", express.static(path.join(__dirname, 'public')));


app.get('/loginpage', (req, res) => {
    res.render('loginpage');
});

// app.get('/helppage', (req, res) => {
//     res.render('helppage');
// });



// var mysqlSessionStore = new mysqlSession (
//     {
//         /* Default option here .... */
//     },
//     require('./database/db')
//     );

//     app.use(sessions({
//         key: "csid",
//         secret: "this is a secret",
//         store: mysqlSessionStore,
//         resave: false,
//         saveUninitialized: false
//     }));

//     app.use((req, res, next) => {
//         if(req.session.username){
//             res.locals.logged = true;
//         }
//         next();
//     })

app.listen(port, () => {
    console.log(`App listening to port ${port}`);
});