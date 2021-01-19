const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    service       : {type: Array},
    subcategories : {type: Array},
    name          : {type: String, required: true},
    description   : {type: String, required: true, maxlength: 500},
    zipcode       : {type: Number, required: true, maxlength: 5, minlegth: 5},
    hours         : {type: String, required: true},
    phone         : {type: Number, required: true, maxlength: 10},
});
/*
const locationSchema = new mongoose.Schema({
    location: [{
         city      : String,
         state     : String,
         zip       : Number,
         address   : String,
     }]
 });
 */