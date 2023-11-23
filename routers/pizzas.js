const express = require('express');
const router = express.Router();
const pizzasController = require('../controllers/pizzas');

// GET /pizzas
router.get('/', pizzasController.index);

// GET /pizzas/:id
router.get('/:id', pizzasController.show);

// POST /pizzas
router.post('/', pizzasController.store);

// PUT /pizzas/:id
router.put('/:id', pizzasController.update);

// DELETE /pizzas/:id
router.delete('/:id', pizzasController.destroy);


module.exports = router;