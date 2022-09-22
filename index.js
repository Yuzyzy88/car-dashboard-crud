const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const cookieParse = require('cookie-parser');
const flash = require('connect-flash');
const { Car } = require('./models');
const { carsRouter } = require('./controllers/car');
const app = express();

const port = process.env.PORT || 8000; 

app.use(express.json());
app.use(express.urlencoded({ extended: false })) // for parsing application/ x-www-form-urlencoded
app.use(expressLayouts);
app.use(express.static('public'));
app.set('view engine', 'ejs');;

// router
app.use('/api/cars', carsRouter)


// configure flash
app.use(cookieParse('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());


// --------------FRONT END 
// index page
app.get('/', (req, res) => {
    Car.findAll().then(Car => {
        res.render("index", {
            layout: 'layouts/main-layout',
            title: 'List Car',
            data: Car,
            msgs: req.flash('msg'),
        })
    })
});

// add page
app.get('/add', (req, res) => {
    res.status(200).render('add', {
        layout: 'layouts/main-layout',
        title: 'Add Car'
    });
});

// update page
app.get('/cars/:id', (req, res) => {
    Car.findByPk(req.params.id).then(Car => {
        res.render("update", {
            layout: 'layouts/main-layout',
            title: 'Update',
            data: Car
        })
    })
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));