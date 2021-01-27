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
const jwtSimple = require('jwt-simple');
// const initalizePassport = require('./passport-config.js');
const methodOverride = require('method-override');


mongoose.set("useFindAndModify", false);
let port = process.env.PORT || 4050;
const mongoDB = process.env.CONNECTION;

const User = require('./models/userSchema.js');
const Resource = require('./models/filterSchema.js');
const { POINT_CONVERSION_COMPRESSED } = require('constants');



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
    // TODO: Create an HTML page to res.redirect to handle the error.....
		return res.sendFile(__dirname + '/public/401.html');
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
  // TODO: Create an HTML page to res.redirect to handle the error.....
	res.sendFile(__dirname + '/public/401.html');
})
/*********LOGOUT*********/
app.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login');
});
    
/*********RESET*********/
app.get('/reset', function (req, res) {
  //this was all moved into the static reset.html page

  // res.send('<form action="/passwordreset" method="POST">' +
  //     '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
  //     '<input type="submit" value="Reset Password" />' +
  // '</form>');
});

app.post('/passwordreset', function (req, res) {
  if (req.body.email !== undefined) {
      var emailAddress = req.body.email;
    
      User.findOne({email: emailAddress}).exec((err, user) => {
        if((err) || (user === null))
        { 

          console.error(err);
          // TODO: Create an HTML page to res.redirect to handle the error.....
          
          return res.sendFile(__dirname + '/public/403.html');

         }
   
        // TODO: Using email, find user from your database.
      var payload = {
        id: user._id,        // User ID from database
        email: emailAddress
    };
    // TODO: Make this a one-time-use token by using the user's
    // current password hash from the database, and combine it
    // with the user's created date to make a very unique secret key!
    // For example:
    // var secret = user.password + ‘-' + user.created.getTime();
    var token = jwtSimple.encode(payload, process.env.RESET_SECRET);
    // TODO: Create an HTML page to do the below task rather than sending a link 
    res.send('<a href="/resetpassword/' + payload.id + '/' + token + '">Reset password</a>');

      })
  
  } else {
      res.send('Email address is missing.');
  }
});

app.get('/resetpassword/:id/:token', function(req, res) {
  // TODO: Fetch user from database using
  // req.params.id
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combine it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();

  var payload = jwtSimple.decode(req.params.token, process.env.RESET_SECRET);

  // TODO: Gracefully handle decoding issues.
  // Create form to reset password.
  res.send('<form action="/resetpassword" method="POST">' +
      '<input type="hidden" name="id" value="' + payload.id + '" />' +
      '<input type="hidden" name="token" value="' + req.params.token + '" />' +
      '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
      '<input type="submit" value="Reset Password" />' +
  '</form>');
});

app.post('/resetpassword',  function(req, res) {
  // TODO: Fetch user from database using
  // req.body.id
  User.findOne({_id: req.body.id}).exec(async (err, updatedUser)  => {
    // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combining it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();

  // var payload = jwtSimple.decode(req.body.token, process.env.RESET_SECRET);

    try {  
  // TODO: Gracefully handle decoding issues.
  // TODO: Hash password from
  // req.body.password
  //do some error handling to bcrypt the new password like how we do when we register a user
  updatedUser.password = await bcrypt.hash(req.body.password, 10);
  updatedUser.save();
  //redirect the user back to the login screen after they get the successful message
  res.redirect('/login');
    } catch {
      res.redirect('/reset.html')
    }

  })
  
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

app.get('/resources/foodPantry', function (req,res) {
  Resource.find({
    services : 'Food Pantry'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
  })
});

app.get('/resources/healthClinic', function (req,res) {
  Resource.find({
    services : 'Health Clinic'
  }, function (err, resources) {
      if(err) return console.error(err);
      res.send(resources);
  })
});

app.get('/resources/clothing', function (req,res) {
  Resource.find({
    services : 'Clothing Closet'
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
    orgname_lower : req.query.name.toLowerCase()
  }, function (err, resources) {
    if(err) return console.error(err);
    res.send(resources);
  })
});

app.post("/resources", (request, res) => {
  let node = new Resource(request.body);
  node.save(function (error, node) {
    if (error) {
      res.sendStatus(500);
      return console.error(error);
    }
    // res.redirect('/index.html');
    return node;
  });
});

