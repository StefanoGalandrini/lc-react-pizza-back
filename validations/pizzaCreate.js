/**
 * @type {import("express-validator").Schema}
 */
module.exports = {
  price: {
    in: ["body"],
    isFloat: {
      errorMessage: "Price must be a float number",
      options: {
        min: 0,
        max: 100,
      },
    },
    notEmpty: {
      errorMessage: "Price is required",
    },
    optional: true
  },
  available: {
    in: ["body"],
    isBoolean: true,
    optional: true,
    toBoolean: true
  },
  glutenFree: {
    in: ["body"],
    isBoolean: true,
    optional: true,
    toBoolean: true
  },
  vegan: {
    in: ["body"],
    isBoolean: true,
    optional: true,
    toBoolean: true
  },
  name: {
    in: ["body"],
    notEmpty: true,
    optional: true
  },
}
