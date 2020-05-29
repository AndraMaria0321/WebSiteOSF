const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash  = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.use(express.json());
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) =>{
  res.locals.error = req.flash('error');
  next();
})

const categoryRoute = require('./routes/category.js');
app.use('/', categoryRoute);

const authRoute = require('./routes/auth.js');
app.use('/', authRoute);

app.all('*', (req, res, next) => {
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`
    });
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
});

mongoose.connect(process.env.DB_PASS, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDb...'))
  .catch(err=> console.log(err));

app.listen(3000, () => {
    console.log("Server 3000...");
})