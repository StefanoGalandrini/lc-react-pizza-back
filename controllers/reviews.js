const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function store(req, res) {
  const datiInIngresso = req.body;

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
