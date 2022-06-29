//import mongoose
const mongoose = require('mongoose')

//connection using string
mongoose.connect('mongodb://localhost:27017/bankApp', {
    useNewUrlParser: true
})

//model definition
const User = mongoose.model('User', {
    acno: Number,
    username: String,
    password: String,
    balance: Number,
    transaction: []
})

//export collection
module.exports = {
    User
}
