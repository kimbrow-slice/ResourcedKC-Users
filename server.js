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
app.get('/forgotpassword', function (req, res) {
  res.send('<form action="/passwordreset" method="POST">' +
      '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
      '<input type="submit" value="Reset Password" />' +
  '</form>');
});

app.post('/passwordreset', function (req, res) {
  if (req.body.email !== undefined) {
      var emailAddress = req.body.email;

      var user = new User(req.body);
    
      var currentUser = User.findOne({_id: emailAddress.id}) 

      // TODO: Using email, find user from your database.
      var payload = {
          id: currentUser,        // User ID from database
          email: emailAddress
      };
      // TODO: Make this a one-time-use token by using the user's
      // current password hash from the database, and combine it
      // with the user's created date to make a very unique secret key!
      // For example:
      // var secret = user.password + ‘-' + user.created.getTime();
      var token = jwt.sign(payload, process.env.RESET_SECRET);
      // TODO: Send email containing link to reset password.
      // In our case, will just return a link to click.
      res.send('<a href="/resetpassword/' + payload.id + '/' + token + '">Reset password</a>');
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

  var payload = jwt.sign(req.params.token, prcoess.env.RESET_SECRET);

  // TODO: Gracefully handle decoding issues.
  // Create form to reset password.
  res.send('<form action="/resetpassword" method="POST">' +
      '<input type="hidden" name="id" value="' + payload.id + '" />' +
      '<input type="hidden" name="token" value="' + req.params.token + '" />' +
      '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
      '<input type="submit" value="Reset Password" />' +
  '</form>');
});

app.post('/resetpassword', function(req, res) {
  // TODO: Fetch user from database using
  // req.body.id
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combining it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();

  var payload = jwt.decode(req.body.token, process.env.RESET_SECRET);

  // TODO: Gracefully handle decoding issues.
  // TODO: Hash password from
  // req.body.password
  res.send('Your password has been successfully changed.');
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




// // // // // CLIENT SIDE // // // // //

app.get('/resources/emergencyShelter', function (req,res) {
  Resource.find({
    services : 'Housing'
  }, function (err, resources) {
    if(err) return console.error(err);
    res.send(resources);
  //"if no resources are categorized to match the GET, respond that no resources exist"
  //"if error, respond with error"
})});

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

