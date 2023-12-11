const express = require("express");
const path = require("path");
const router = express.Router();
const pizzasController = require("../controllers/pizzas");
const { body, checkSchema, query } = require("express-validator");
const pizzaCreate = require("../validations/pizzaCreate");
const { checkValidity } = require("../middlewares/schemaValidator");
const authHandler = require("../middlewares/authHandler");
const authRoleHandler = require("../middlewares/authRoleHandler");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// GET /pizzas
router.get(
  "/",
  query("filters.name").optional().isString(),
  pizzasController.index
);

// GET /pizzas/:id
router.get("/:id", pizzasController.show);

// POST /pizzas
router.post(
  "/",
  multer({ storage: storage }).single("image"),
  // authHandler,
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
router.put(
  "/:id",
  // authHandler,
  authRoleHandler("admin"),
  multer({ storage: storage }).single("image"),
  checkSchema(pizzaCreate),
  checkValidity,
  pizzasController.update
);

// DELETE /pizzas/:id
router.delete("/:id", authHandler, pizzasController.destroy);

module.exports = router;
