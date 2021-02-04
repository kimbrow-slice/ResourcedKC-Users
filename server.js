require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const formidable = require('formidable');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const jwt= require('jsonwebtoken');
const jwtSimple = require('jwt-simple');
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



app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.use(express.static(path.join(__dirname, "/public")));

app.use("/authed", express.static(path.join(__dirname, "/authed")));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));

app.listen(port, function () {
  console.log("The server is up and running at " + port);
});

/*********INDEX*********/
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    });

/*********LOGIN*********/
app.get('/login',  function (req, res) {
  res.sendFile(__dirname + '/public/login.html');
  });

app.post('/login', (req, res) => {
  passport.authenticate('local', { session: false}, (error, user) => {
      //this response will be switched later with the response of 401 redirect to the HTML page created to handle this.
      if( error || !user) {
          res.status(400).json ({ error });
      }
      // creating a payload (what we are taking in liek username and password)
      const payload = {
          username: user.username,
          id: user._id,
          expires: Date.now() + parseInt(process.env.JWT_EXPIRE_MS),
      };

      //assigning the payload to req.user for later
      req.login(payload, {session : false}, (error) => {
          //this response will be switched later with the response of 401 redirect to the HTML page created to handle this.
          if(error){
              res.status(400).send({ error });
          }
          //generating a signed JWT and returning with response
          const token = jwt.sign(JSON.stringify(payload), process.env.secret);

          //assign our jwt to the cookies
          res.cookie('jwt', jwt, { httpOnly: true, secure : true });
          //this is where I will redirect them to the route ('/authed')
          res.status(200).send({ username });
      });
  },
  )(req, res);
});
/**AUTHED HANDLING**/

app.get('/authed', (req,res) => {
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
      const {user} = req;
      //this is where they will be redirected to ('/authed/welcome.html')
      res.status(200).send({ user });
  }
});



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

app.get('/resources/sextrafficking', function (req,res) {
  Resource.find({
    services : 'Sex Trafficking'
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

