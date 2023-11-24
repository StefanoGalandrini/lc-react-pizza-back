const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const NotFound = require("../exceptions/NotFound");
const ValidationError = require("../exceptions/ValidationError");

async function index(req, res) {
  // Permetto di filtrare per name, price, available
  const filters = req.query.filter;
  const queryFilter = {};
  const page = req.query.page || 1;
  const perPage = 5;

  // Se ho dei filtri e se questi contenono il campo name
  if (filters && filters.name) {
    queryFilter.name = {
      contains: filters.name,
    };
  }

  // Se ho dei filtri e se questi contenono il campo price
  if (filters && filters.price) {
    queryFilter.price = {
      gte: parseFloat(filters.price),
    };
  }

  // Se ho dei filtri e se questi contenono il campo available
  if (filters && filters.available) {
    queryFilter.available = {
      equals: filters.available === "true" || filters.available === "1",
    };
  }

  const total = await prisma.pizza.count({where: queryFilter});

  const data = await prisma.pizza.findMany({
    // pagina da cui partire a contare. 
    // Siccome all'utente facciamo contare a partire da 1,
    // mentre il db parte da 0, sottraggo 1 dalla pagina corrente
    // skip indica a partire da quale indice iniziare a recuperare i dati
    skip: (page - 1) * perPage,
    // elementi per pagina
    take: perPage, 
    where: queryFilter,
    // Caso di un OR
    // where: {
    //   OR: [
    //     {
    //       name: {
    //         contains: filters.name,
    //       },
    //     },
    //     {
    //       description: {
    //         contains: filters.name,
    //       },
    //     }
    //   ]
    // }
  });

  return res.json({
    data,
    page,
    perPage,
    total
  });
}

async function show(req, res, next) {
  // const id = req.params.id;
  const { id } = req.params;

  const data = await prisma.pizza.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!data) {
    /*
    Siccome la funzione è async, se lancio un'eccezione
    tramite throw new Error, questa NON verrà gestita 
    e l'applicazione andrà in crash.
    Per evitare questo, posso inoltrare l'errore al prossimo
    middleware tramite la funzione next.
    */
    return next(new NotFound("La pizza indicata non è stata trovata."));
  }

  return res.json(data);
}

async function store(req, res, next) {
  const datiInIngresso = req.body;

  if (!datiInIngresso.name) {
    return next(new ValidationError("Il campo name è obbligatorio"));
  }

  const newPizza = await prisma.pizza.create({
    data: {
      name: datiInIngresso.name,
      description: datiInIngresso.description,
      price: datiInIngresso.price,
      available: datiInIngresso.available,
      glutenFree: datiInIngresso.glutenFree,
      vegan: datiInIngresso.vegan,
      image: datiInIngresso.image,
    },
  });

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

  if (!pizza) {
    throw new Error("Not found");
  }

  const pizzaAggiornata = await prisma.pizza.update({
    data: datiInIngresso,
    where: {
      id: parseInt(id),
    },
  });

  return res.json(pizzaAggiornata);
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
