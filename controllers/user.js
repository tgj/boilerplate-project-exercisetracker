const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

exports.user_create_post = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    return res.json({ error: "invalid username" });
  }

  const username = req.body.username;

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
          .catch((err) => {
            console.log(err);
            next(err);
          });
      } else {
        console.log("Username exists, sending error response...");
        res.json({
          error: "username exists",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

exports.user_list_get = asyncHandler(async (_, res, next) => {
  User.find()
    .then((doc) => {
      res.json(
        doc.map((el) => ({
          _id: el.id,
          username: el.username,
        }))
      );
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});
