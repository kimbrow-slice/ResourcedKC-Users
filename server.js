require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const jwtStrategry  = require("./passport-config.js");
passport.use(jwtStrategry);
const jwt= require('jsonwebtoken');
// const initalizePassport = require('./passport-config.js');
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

app.use(passport.initialize());
// app.use(passport.session());


 //test comment

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
// initalizePassport(
//   passport, 
//   username => User.findOne( {'username':username}).lean(),
//   id => User.findOne( { '_id' : id }).lean()
//  );

/*********INDEX*********/
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    });

/*********LOGIN*********/
app.get('/login',  function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
    });



app.post('/login',  async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()
	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}
	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			process.env.secret
		)
		return res.redirect('/submitResource.html');
	}
	res.json({ status: 'error', error: 'Invalid username/password' })
})
/*********LOGOUT*********/
app.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login');
});
    
/*********RESET*********/
app.get('/reset', function (req, res) {
        res.sendFile(__dirname + '/public/reset.html');
    });


app.post('/reset', function (req, res) {
      res.sendFile(__dirname + '/public/reset.html');
  });
/*********REGISTER*********/
app.get('/register',  function (req, res) {
    res.sendFile(__dirname + '/public/register.html');
    });
app.post('/register',  async function (req,res) {

  
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
  })
});

app.get('/resources/housing', function (req,res) {
Resource.find({
  services : 'Housing' // finds all resources in db with services listed as housing
}, function (err, resources) {
    if(err) return console.error(err);
    res.send(resources);
  })
});

app.get('/resources/financialAssistance', function (req,res) {
  Resource.find({
    services : 'Financial Assistance'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
  })
});

app.get('/resources/foodPantries', function (req,res) {
  Resource.find({
    services : 'Food Pantries'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
  })
});

app.get('/resources/healthClinics', function (req,res) {
  Resource.find({
    services : 'Health Clinics'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
  })
});

app.get('/resources/clothing', function (req,res) {
  Resource.find({
    services : 'Clothing Closets'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
  })
});

app.get('/resources/rehab', function (req,res) {
  Resource.find({
    services : 'Rehab and Detox'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
  })
}); 

app.get('/resources/search', function (req,res) {
  //console.log(req.query)
  Resource.find({ 
    orgname_lower : req.query.name.toLowercase()
  }, function (err, resources) {
    if(err) return console.error(err);
    res.send(resources);
  })
});

/*
  function getNameFromUrl() {
    let query;
    const urlParams = new URLSearchParams(query);
    return urlParams.get('name').replace('+', ' ');
  };
*/

function checkAuthed(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }};

