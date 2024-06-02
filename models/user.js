const mongoose = require("mongoose");
const { exerciseSchema } = require("../models/exercise");

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  exercises: [exerciseSchema],
});

module.exports = mongoose.model("User", userSchema);
