/**
 * @type {import("express-validator").Schema}
 */
module.exports = {
  price: {
    in: ["body"],
    isFloat: {
      options: {
        min: 0,
        max: 100,
      },
    },
    optional: true
  },
  available: {
    in: ["body"],
    isBoolean: true,
    optional: true
  },
  glutenFree: {
    in: ["body"],
    isBoolean: true,
    optional: true
  },
  vegan: {
    in: ["body"],
    isBoolean: true,
    optional: true
  },
  name: {
    in: ["body"],
    notEmpty: true,
    optional: true
  },
}
