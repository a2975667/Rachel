var mongoose = require('mongoose');

var SickSchema = new mongoose.Schema({
    name: String,
    like:[String],
    dislike:[String],
    have:[String],
    not:[String],
});

module.exports = mongoose.model('Sick', SickSchema);