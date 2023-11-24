const NotFound = require("../exceptions/NotFound");

module.exports = function (req, res, next) {
  next(new NotFound("La rotta richiesta non è stata trovata"));
}