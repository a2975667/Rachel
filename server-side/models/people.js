var mongoose = require('mongoose');

var PeopleSchema = new mongoose.Schema({
    facebookid: String,
    name: String,
    family: Boolean,
    relationship: {type: String, default: "people"},
    disease: [String],
    like:[String],
    dislike:[String],
    have:[String],
    not:[String],
});

module.exports = mongoose.model('People', PeopleSchema);