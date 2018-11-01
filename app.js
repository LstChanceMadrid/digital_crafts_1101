const express = require('express');
const app = express();
const port = 3000;
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var session = require('express-session');

let trips = []
let users = [
    {username : "steve", password : "password"},
    {username : "bob", password : 'password'}
]


// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false
}))



const authenticateUser = (req, res, next) => {

    console.log('loggin in')
    if(req.session.username) {
        next();
    } else {
        res.redirect('/login')
    }
}


app.all("/login/*",authenticateUser,function(req,res,next){
    next()
})




app.get('/', (req, res) => res.send('Hello World!'))

app.get('/login', (req, res) => {
    res.render('login')
})



app.post('/login', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    let user = users.find(user => {
        return user.username === username && user.password === password
    })

    if (user != null) {
        if(req.session) {
            req.session.username = username
            res.redirect('/home')
        }
    } else {
        res.redirect('login')
    }
})

app.get('/home', (req, res) => {
    let username = req.session.username;
    console.log(trips)
    res.render('home', {username: username, trips : trips})
})


app.post('/add-trip', (req, res) => {

    let title = req.body.tripTitle;
    let location = req.body.tripLocation;
    let departureDate = req.body.tripDepartureDate;
    let returnDate = req.body.tripReturnDate;

    let tripItem = {
        title : title,
        location : location,
        departureDate : departureDate,
        returnDate : returnDate
    };
    
    trips.push(tripItem);

    res.redirect('/home');

});

app.post('/remove-trip', (req, res) => {
    let title = req.body.removeTripTitle;
    
    trips = trips.filter(trip => {
        return trip.title != title;
    });

    res.redirect('/home');
});

app.post('/filter', (req, res) => {
    let location = req.body.tripLocation;


    trips = trips.filter(trip => {
        return trip.location === location;
    });

    res.redirect('/home');
});








app.listen(port, () => console.log(`Example app listening on port ${port}!`))