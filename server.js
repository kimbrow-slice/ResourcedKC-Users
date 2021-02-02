require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const formidable = require('formidable');
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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "public")));
app.use("public/authed", function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login.html');
    }
    next();    
});
//app.use(express.static(path.join(__dirname, "public/authed")));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));

/*********INDEX*********/
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    });

/*********LOGIN*********/
app.get('/login',  function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
    });

app.post('/login', (req, res) => {
  console.log('test');
 
  let form = new formidable.IncomingForm(); 
  form.parse(req, async function(err, fields, files){
      console.log(fields); 
      let username = fields.username;
      let password = fields.password;
  console.log(username); 
      console.log(password); 
	const user = await User.findOne({ username }).lean()
	if (!user) {
   
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
    console.log(user._id);
    //I need to find a way to send over the user._id to the client side so it can be stored later to allow the user to only update their resources and to view their resources
		return res.json({id: user._id});
  }
  res.sendFile(__dirname + '/public/401.html');
  }); 
})

/*********LOGOUT*********/
app.delete('/logout', (req,res) => {
    req.logOut();
    res.sendStatus(204);
});
    
/*********RESET*********/
app.get('/reset', function (req, res) {
});

app.post('/passwordreset', function (req, res) {
  if (req.body.email !== undefined) {
      var emailAddress = req.body.email;
    
      User.findOne({email: emailAddress}).exec((err, user) => {
        if((err) || (user === null))
        { 
          console.error(err);

          return res.sendFile(__dirname + '/public/403.html');

         }

      var payload = {
        id: user._id,        // User ID from database
        email: emailAddress
    };

    var token = jwtSimple.encode(payload, process.env.RESET_SECRET);

    res.send('<a href="/resetpassword/' + payload.id + '/' + token + '">Reset password</a>');

      })
  
  } else {
      res.send('Email address is missing.');
  }
});

app.get('/resetpassword/:id/:token', function(req, res) {


  var payload = jwtSimple.decode(req.params.token, process.env.RESET_SECRET);

  res.send('<form action="/resetpassword" method="POST">' +
      '<input type="hidden" name="id" value="' + payload.id + '" />' +
      '<input type="hidden" name="token" value="' + req.params.token + '" />' +
      '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
      '<input type="submit" value="Reset Password" />' +
  '</form>');
});

app.post('/resetpassword',  function(req, res) {
  User.findOne({_id: req.body.id}).exec(async (err, updatedUser)  => {
    try {  
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

app.post("/resources/", (request, res) => {


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

