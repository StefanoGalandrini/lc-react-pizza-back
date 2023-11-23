const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function index(req, res) {
  const data = await prisma.pizza.findMany();

  return res.json(data);
}

async function show(req, res) {
  // const id = req.params.id;
  const { id } = req.params;

  const data = await prisma.pizza.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!data) {
    throw new Error("Not found");
  }

  return res.json(data);
}

async function store(req, res) {
  const datiInIngresso = req.body;

  const newPizza = await prisma.pizza.create({
    data: {
      name: datiInIngresso.name,
      description: datiInIngresso.description,
      price: datiInIngresso.price,
      available: datiInIngresso.available,
      glutenFree: datiInIngresso.glutenFree,
      vegan: datiInIngresso.vegan,
      image: datiInIngresso.image,
    }
  })

  return res.json(newPizza);
}

async function update(req, res) {
  const id = req.params.id;
  const datiInIngresso = req.body;

  // controllo che quella pizza esista
  const pizza = await prisma.pizza.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if(!pizza){
    throw new Error('Not found');
  }

  const pizzaAggiornata = await prisma.pizza.update({
    data: datiInIngresso,
    where: {
      id: parseInt(id),
    },
  })

  return res.json(pizzaAggiornata)
}

async function destroy(req, res) {
  await prisma.pizza.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  return res.json({ message: "Pizza eliminata" });
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
