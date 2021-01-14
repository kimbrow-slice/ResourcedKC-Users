const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {type: String, required: true, maxlength: 25},
    password : {type: String, required: true, minlength: 8},
    password2: {type: String, required: true, minlength: 8},
    email : {type: String, required: true, maxlength: 150},
    admin : {type: Boolean},
    token :{
        type: String
    }
});

module.exports = mongoose.model("User", userSchema);