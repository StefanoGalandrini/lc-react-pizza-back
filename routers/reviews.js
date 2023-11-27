const { Router } = require("express");
const router = Router();
const reviewsController = require("../controllers/reviews");
const { body } = require("express-validator");

router.post(
  "/",
  body("content").isString().notEmpty().isLength({ min: 10 }),
  body("rating").isNumeric().isInt({ min: 1, max: 5 }),
  body("pizzaId").isNumeric().isInt({ min: 1 }),
  reviewsController.store
);

module.exports = router;
