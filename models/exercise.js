const mongoose = require("mongoose");

let exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = {
  Exercise,
  exerciseSchema,
};
