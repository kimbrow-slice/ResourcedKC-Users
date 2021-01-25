if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initalizePassport = require('./passport-config.js');
const methodOverride = require('method-override');


mongoose.set("useFindAndModify", false);
let port = process.env.PORT || 4050;
const mongoDB =
  "mongodb+srv://dbAdmin:SKCstudent@cluster0.ewhdg.mongodb.net/ResourcedKC?retryWrites=true&w=majority";

const User = require('./models/userSchema.js');
const Resource = require('./models/filterSchema.js');
const { urlencoded } = require('body-parser');

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.error(err);
    //check to see if connection worked.
    console.log("Connected to database");
  }
);
app.listen(port, function () {
    console.log("The server is up and running at " + port);
  });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ 
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : false
}));

 //test comment

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
initalizePassport(
  passport, 
  username => User.findOne( {'username':username}).lean(),
  id => User.findOne( { '_id' : id }).lean()
 );

app.get('/', checkAuthed, function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    });


app.get('/login', checkNotAuthed ,function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
    });

app.post('/login', checkNotAuthed, passport.authenticate('local', {
      successRedirect : '/',
      failureRedirect: '/login',
      failureFlash: true
    })); 

app.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login');
});
    
  function checkAuthed(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
    
      res.redirect('/login');
    }
    
  function checkNotAuthed(req, res, next){
      if(req.isAuthenticated()){
       return res.redirect('/');
      }
      next();
    }
    
    
    
    //req, res) => {
    
      // let authedUser = req.body.password + req.body.username;
      // if(req.body.username != username ){
      //   res.statusCode = 400;
      //   res.failureFlash = true;
      //   console.log('Username does not match our records');
      //   res.failureRedirect = '/login'
      //   console.log('Welcome to login');
      // }
      // if(req.body.password != password){
      //   res.statusCode = 400;
      //   res.failureFlash = true;
      //   console.log('Password does not match our records');
      //   res.failureRedirect = '/login'
      //   console.log('Welcome to login');
      // }
      // if(req.body.username && req.body.password === authedUser){
      //   res.statusCode = 200;
      //   res.successRedirect = '/'
      //   console.log('Welcome to login');
      // }
    
      //   })
    

app.get('/register', checkNotAuthed, function (req, res) {
    res.sendFile(__dirname + '/public/register.html');
    });
app.get('/reset', function (req, res) {
        res.sendFile(__dirname + '/public/reset.html');
    });

app.post('/register',checkNotAuthed,  async function (req,res) {
  
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    var newUser = new User(req.body);
    newUser.save(function(error,user){
      res.redirect('/login');
    });  
  } catch{
    res.redirect('/register');
  }
  // console.log(newUser);
});


app.get('/resources/emergencyShelter', function (req,res) {
  Resource.find({
    services : 'Emergency Shelter'
  }, function (err, resources) {
    if(err) return console.error(err);
    res.send(resources);
})});

app.get('/resources/housing', function (req,res) {
Resource.find({
  services : 'Housing' // finds all resources in db with services listed as housing
}, function (err, resources) {
    if(err) return console.error(err);
    res.send(resources);
})});

app.get('/resources/financialAssistance', function (req,res) {
  Resource.find({
    services : 'Financial Assistance'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
})});

app.get('/resources/foodPantries', function (req,res) {
  Resource.find({
    services : 'Food Pantries'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
})});

app.get('/resources/healthClinics', function (req,res) {
  Resource.find({
    services : 'Health Clinics'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
})});

app.get('/resources/clothing', function (req,res) {
  Resource.find({
    services : 'Clothing Closets'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
})});

app.get('/resources/rehab', function (req,res) {
  Resource.find({
    services : 'Rehab and Detox'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
})});

app.post('/resources/:query', function (req,res) {
  Resource.find({ 
    orgname : getNameFromUrl()
  }, function (err, resources) {
    if(err) return console.err(err);
    res.send(resources);
  })});

  function getNameFromUrl() {
    let query = window.location.search;
    const urlParams = new URLSearchParams(query);
    return urlParams.get('name').replace('+', ' ');
  };

function checkAuthed(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }};

