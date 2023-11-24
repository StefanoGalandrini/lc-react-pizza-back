const {Router} = require('express');
const router = Router();
const ingredientsController = require("../controllers/ingredients");

router.post("/", ingredientsController.store)

module.exports = router;