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
app.post('/reset', function (req, res) {
  const email = req.body.email
  User
      .findOne({
          where: {email: email},//checking if the email address sent by client is present in the db(valid)
      })
      .then(function (user) {
          if (!user) {
              return throwFailed(res, 'No user found with that email address.')
          }
          ResetPassword
              .findOne({
                  where: {userId: user.id, status: 0},
              }).then(function (resetPassword) {
              if (resetPassword)
                  resetPassword.destroy({
                      where: {
                          id: resetPassword.id
                      }
                  })
              token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password form (react)
              bcrypt.hash(token, null, null, function (err, hash) {//hashing the password to store in the db node.js
                  ResetPassword.create({
                      userId: user.id,
                      resetPasswordToken: hash,
                      expire: moment.utc().add(config.tokenExpiry, 'seconds'),
                  }).then(function (item) {
                      if (!item)
                          return throwFailed(res, 'Oops problem in creating new password record')
                      let mailOptions = {
                          from: '"<Resourced KC Admins>" ResourcedKC@gmail.com',
                          to: user.email,
                          subject: 'Reset your account password',
                          html: '<h4><b>Reset Password</b></h4>' +
                          '<p>To reset your password, complete this form:</p>' +
                          '<a href=' + config.clientUrl + 'reset/' + user.id + '/' + token + '">' + config.clientUrl + 'reset/' + user.id + '/' + token + '</a>' +
                          '<br><br>' +
                          '<p>--Team</p>'
                      }
                      let mailSent = sendMail(mailOptions)//sending mail to the user where he can reset password.User id and the token generated are sent as params in a link
                      if (mailSent) {
                          return res.json({success: true, message: 'Check your mail to reset your password.'})
                      } else {
                          return throwFailed(error, 'Unable to send email.');
                      }
                  })
              })
          });
      })
})

app.post('/reset', function (req, res) {//handles the new password from react
  const userId = req.body.userId
  const token = req.body.token
  const password = req.body.password
  ResetPassword.findOne({ where:{ userId: userId ,status : 0 }})
  .then(function (resetPassword) {
  if (!resetPassword) {
  return throwFailed(res, 'Invalid or expired reset token.')
  }
  bcrypt.compare(token, resetPassword.token, function (errBcrypt, resBcrypt) {// the token and the hashed token in the db are verified befor updating the password
  let expireTime = moment.utc(resetPassword.expire)
  let currentTime = new Date();
  bcrypt.hash(password, null, null, function (err, hash) {
  User.update({
  password: hash,
  },
  { where: { id: userId }}
  ).
  then(() => {
  ResetPassword.update({
  status: 1
  },{ where: {id : resetPassword.id}}).
  then((msg) => {
  if(!msg)
  throw err
  else
  res.json({ success: true, message: 'Password Updated successfully.' })
  })
  })
  });
  });
  }).catch(error => throwFailed(error, ''))
  })
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

