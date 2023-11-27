const express = require("express");
const router = express.Router();
const pizzasController = require("../controllers/pizzas");
const { body, checkSchema } = require("express-validator");
const pizzaCreate = require("../validations/pizzaCreate");
const {checkValidity} = require("../middlewares/schemaValidator");
const authHandler = require("../middlewares/authHandler");
const authRoleHandler = require("../middlewares/authRoleHandler");

// GET /pizzas
router.get("/", pizzasController.index);

// GET /pizzas/:id
router.get("/:id", pizzasController.show);

// POST /pizzas
router.post(
  "/",
  authHandler,
  body("name").notEmpty(),
  body("price").isFloat({ min: 0, max: 100 }),
  body("available").isBoolean(),
  body("glutenFree").isBoolean().optional(),
  body("vegan").isBoolean(),
  pizzasController.store
);

// PUT /pizzas/:id
// router.put("/:id", checkSchema(pizzaCreate), pizzasController.update);
// router.put("/:id", schemaValidator(pizzaCreate), pizzasController.update);
router.put("/:id", authHandler, authRoleHandler("admin"), checkSchema(pizzaCreate), checkValidity, pizzasController.update);

// DELETE /pizzas/:id
router.delete("/:id", authHandler, pizzasController.destroy);

module.exports = router;
