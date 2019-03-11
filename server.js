require('dotenv').config();
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 8080;
const passport = require('passport');
const authenticationRoute = require('./routes/authentication');
const googleAuthentication = require('./googleAuthentication');
const session = require('express-session');
const log = console.log;

googleAuthentication(passport); // passport google strategy work

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

authenticationRoute(app, passport);

app.listen(PORT, () => log('Server is starting ', PORT));