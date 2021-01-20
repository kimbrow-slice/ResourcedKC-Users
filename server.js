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


mongoose.set("useFindAndModify", false);
let port = process.env.PORT || 4050;
const mongoDB =
  "mongodb+srv://dbAdmin:SKCstudent@cluster0.ewhdg.mongodb.net/ResourcedKC?retryWrites=true&w=majority";

const User = require('./models/userSchema.js');





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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret:process.env.SEESION_SECRET,
  resave: false,
  saveUninitialized: false
}));


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


app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
    });

app.post('/login',passport.authenticate('local', {
      successRedirect : '/',
      failureRedirect: '/login',
      failureFlash: true
    })); //req, res) => {
    
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
    

app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/public/register.html');
    });
app.get('/reset', function (req, res) {
        res.sendFile(__dirname + '/public/reset.html');
    });

app.post('/register', async function (req,res) {
  
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




// // // // // CLIENT SIDE // // // // //

app.get('/resources/emergency_shelter', function (req,res) {
  //"if the service of the resource matches the GET, then respond with that resource's information"
  //"if no resources are categorized to match the GET, respond that no resources exist"
  //"if error, respond with error"
});

app.get('/resources/housing', function (req,res) {

});

app.get('/resources/financial_assistance', function (req,res) {

});

app.get('/resources/...', function (req,res) {

});

function checkAuthed(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/login');
}
