const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    services       : [String],
    servicesub     : [String],
    usercategories : [String],
    orgname        : {type: String, required: true},
    orgname_lower  : {type: String, required: true}, 
    description    : {type: String, required: true, maxlength: 500},
    zipcode        : {type: Number, required: true, maxlength: 5, minlegth: 5},
    hours          : {type: String, required: true},
    phone          : {type: Number, required: true, maxlength: 10},
    website        : {type: String}
});

module.exports = mongoose.model("resource", resourceSchema);

