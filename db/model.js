const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    instructorId: String,
    checkIn: Date,
    checkOut: Date, 
    active: Boolean
});
module.exports = mongoose.model('instructorsLog',schema);