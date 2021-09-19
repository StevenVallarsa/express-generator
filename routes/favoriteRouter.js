const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then(favorites => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch(err => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then(favorite => {
      if (favorite) {
        req.body.forEach(fave => {
          if (!favorite.campsites.includes(fave._id)) {
            favorite.campsites.push(fave._id);
          }
        });
        favorite
          .save()
          .then(fave => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(fave);
          })
          .catch(err => next(err));
      } else {
        Favorite.create({ user: req.user._id, campsites: req.body })
          .then(fave => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(fave);
          })
          .catch(err => next(err));
      }
    });
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (Favorite.findOne({ user: req.user._id })) {
      Favorite.findOneAndDelete({ user: req.user._id })
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.end("You do not have any favorites to delete.");
    }
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorite => {
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
          } else {
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json");
            res.end(`Campsite ${req.params.campsiteId} is already in your favorites.`);
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          });
        }
        favorite.save().then(favorite => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        });
      })
      .catch(err => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorite => {
        if (!favorite.campsites.includes(req.params.campsiteId)) {
          res.statusCode = 403;
          res.end(`You don't have campground ${req.params.campsiteId} in your favorites`);
        } else {
          const newFavorites = favorite.campsites.filter(f => f.toString() !== req.params.campsiteId);
          favorite.campsites = newFavorites;
          favorite.save();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        }
      })
      .catch(err => next(err));
  });

module.exports = favoriteRouter;
