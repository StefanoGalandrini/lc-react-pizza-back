const {Router} = require('express');
const router = Router();
const reviewsController = require("../controllers/reviews");

router.post("/", reviewsController.store)

module.exports = router;