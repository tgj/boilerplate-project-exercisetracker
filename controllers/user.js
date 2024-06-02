const User = require("../models/user");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

mongoose.connect(process.env.MONGO_URI);

exports.user_create_post = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    return res.json({ error: "invalid username" });
  }

  const username = req.query.username;

  User.findOne({ username })
    .then((doc) => {
      if (!doc) {
        const user = new User({ username });
        user
          .save()
          .then((doc) => {
            console.log("User saved: " + user);
            return res.json({
              username: doc.username,
              _id: doc._id,
            });
          })
          .catch((err) => console.log(err));
      } else {
        console.log("Username exists, sending error response...");
        res.json({
          error: "username exists",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
