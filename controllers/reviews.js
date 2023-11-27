const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {validationResult, matchedData} = require("express-validator");

async function store(req, res) {
  const validation = validationResult(req);

  if(!validation.isEmpty()) {
    return res.status(422).json(validation.array());
  }

  // estrae dai dati del body solo quelli che ci servono e sono stati specificati dal middleware validator
  const datiInIngresso = matchedData(req);

  const newIngredient = await prisma.recensione.create({
    data: {
      content: datiInIngresso.content,
      rating: datiInIngresso.rating,
      pizza: {
        connect: {
          id: datiInIngresso.pizzaId,
        },
      }
      // pizzaId: datiInIngresso.pizzaId,
    },
    include: {
      pizza: true,
    }
  });

  return res.json(newIngredient);
}

module.exports = {
  store,
};
