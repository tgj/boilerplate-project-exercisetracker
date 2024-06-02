const { Exercise, exerciseSchema } = require("../models/exercise");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

exports.exercise_create_post = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    return res.json({ error: "invalid request" });
  }

  const { _id, description, duration, date } = req.body;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        const msg = `Error: User with id: ${_id} not found`;
        console.error(msg);
        return res.json({
          error: msg,
        });
      } else {
        console.log(`User with id: ${_id} found`);

        const exercise = new Exercise({
          description,
          duration,
          date: date ? new Date(date) : new Date(),
        });
        user.exercises.push(exercise);

        user
          .save()
          .then((_) => {
            res.json({
              _id: _id,
              username: user.username,
              description,
              duration,
              date: exercise.date.toDateString(),
            });
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

exports.exercise_logs_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED");
});
