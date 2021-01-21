const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    services       : {type: Array},
    servicesub     : {type: Array},
    usercategories : {type: Array},
    orgname        : {type: String, required: true},
    description    : {type: String, required: true, maxlength: 500},
    zipcode        : {type: Number, required: true, maxlength: 5, minlegth: 5},
    hours          : {type: String, required: true},
    phone          : {type: Number, required: true, maxlength: 10},
    website        : {type: String}
});

module.exports = mongoose.model("resource", resourceSchema);

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