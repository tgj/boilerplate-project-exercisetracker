const { Exercise, exerciseSchema } = require("../models/exercise");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

exports.exercise_create_post = asyncHandler(async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      console.log(validationErrors);
      return res.json({ error: "invalid request" });
    }

    const { description, duration, date } = req.body;
    const _id = req.body[":_id"] || req.params._id;

    const user = await User.findById(_id);
    if (!user) {
      const msg = `Error: User with id: ${_id} not found`;
      console.log(msg);
      return res.json({
        error: msg,
      });
    }

    const checkDate = (date) => {
      if (!date) {
        return new Date(Date.now());
      } else {
        const parts = date.split("-");
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);

        const utcDate = new Date(Date.UTC(year, month, day));
        return new Date(
          utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
        );
      }
    };

    const exercise = new Exercise({
      description,
      duration: Number(duration),
      date: checkDate(date),
    });
    user.exercises.push(exercise);

    user
      .save()
      .then((_) => {
        return res.json({
          username: user.username,
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
          _id: user._id,
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
});

exports.exercise_logs_get = asyncHandler(async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      console.log(validationErrors);
      return res.json({ error: "invalid request" });
    }

    const { _id } = req.params;
    const { limit, from, to } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      const msg = `Error: User with id: ${_id} not found`;
      console.log(msg);
      return res.json({
        error: msg,
      });
    }

    let exercises = user.exercises;

    if (from) {
      const fromDate = new Date(from);
      exercises = exercises.filter((exer) => exer.date > fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      exercises = exercises.filter((exer) => exer.date < toDate);
    }

    if (limit) {
      exercises = exercises.slice(0, limit);
    }

    return res.json({
      username: user.username,
      count: limit || exercises.length,
      _id,
      log: exercises.map((exer) => {
        return {
          description: exer.description,
          duration: exer.duration,
          date: exer.date.toDateString(),
        };
      }),
    });
  } catch (err) {
    console.error(err);
    return res.json({ error });
  }
});
