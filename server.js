const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.set("useFindAndModify", false);
let port = process.env.PORT || 4050;
const mongoDB =
  "mongodb+srv://dbAdmin:SKCstudent@cluster0.ewhdg.mongodb.net/ResourcedKC?retryWrites=true&w=majority";

var User = require('./models/userSchema.js');

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

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    });

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
    });

app.post('/login',function (req,res) {

    })
    

app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/public/register.html');
    });
app.get('/reset', function (req, res) {
        res.sendFile(__dirname + '/public/reset.html');
    });

app.post('/register',function (req,res) {
    const newuser = new User(req.body);

    if(newuser.password!=newuser.password2) return res.status(418).json({message: "password does not match"});
  
    User.findOne({email:newuser.email}, function(err,user){
      if(user) return res.status(400).json({ auth: false, message: "email is already registered"});
  
      newuser.save((err,doc)=>{
        if(err) {console.log(err);
        return res.status(400).json({success : false});}
        res.status(200).json({
          success : true,
          user : doc
        });
      });
    });
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
