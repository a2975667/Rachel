var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    facebookid: String,
    name: String,
    disease: [String],
    like: [String],
    dislike: [String],
    have: [String],
    not: [String],
    reminder: [{
        key: String,
        info: String,
        endTime: Date,
        people: [String],
        object: String,
        verb: String
    }],
    calender: [{
        key: String,
        info: String,
        startTime: Date,
        endTime: Date,
        people: [String],
        object: String,
        verb: String
    }]
});

module.exports = mongoose.model('User', UserSchema);