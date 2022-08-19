const mongoose = require("mongoose");
const schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    }

}, {
    timestamps: true
})

const userModel = mongoose.model("users", UserSchema)

module.exports = userModel