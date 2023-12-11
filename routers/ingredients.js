const {Router} = require('express');
const router = Router();
const ingredientsController = require("../controllers/ingredients");

router.get("/", ingredientsController.index)
router.post("/", ingredientsController.store)

module.exports = router;