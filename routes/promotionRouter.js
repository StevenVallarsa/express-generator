const express = require("express");
const Promotion = require("../models/promotions");
const authenticate = require("../authenticate");

const promotionRouter = express.Router();

promotionRouter
  .route("/")

  .get((req, res, next) => {
    Promotion.find()
      .then(promotions => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch(err => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    Promotion.create(req.body)
      .then(partner => {
        console.log("Promotion created ", partner);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch(err => next(err));
  })

  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operations not supported on /promotions");
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.deleteMany()
      .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch(err => next(err));
  });

promotionRouter
  .route("/:PromotionId")

  .get((req, res, next) => {
    Promotion.findById(req.params.PromotionId)
      .then(partner => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch(err => next(err));
  })

  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.PromotionId}`);
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.PromotionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(partner => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch(err => next(err));
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.PromotionId)
      .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch(err => next(err));
  });

module.exports = promotionRouter;
