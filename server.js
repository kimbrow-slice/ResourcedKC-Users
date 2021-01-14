const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


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
  console.log(newUser);
});
