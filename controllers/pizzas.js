const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const NotFound = require("../exceptions/NotFound");
const ValidationError = require("../exceptions/ValidationError");

const { validationResult } = require("express-validator");

async function index(req, res) {
  // Permetto di filtrare per name, price, available
  const filters = req.query.filter;
  const queryFilter = {};
  const page = req.query.page || 1;
  const perPage = 20;

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

  const total = await prisma.pizza.count({ where: queryFilter });

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
    include: {
      dettaglio: true,
      ingredienti: true,
      // recensioni: true,
    },
  });

  return res.json({
    data,
    page,
    perPage,
    total,
  });
}

async function show(req, res, next) {
  // const id = req.params.id;
  const { id } = req.params;

  const data = await prisma.pizza.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      dettaglio: true,
      ingredienti: true,
      recensioni: true,
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
  const validation = validationResult(req);

  // isEmpty si riferisce all'array degli errori di validazione.
  // Se NON è vuoto, vuol dire che ci sono errori
  if (!validation.isEmpty()) {
    /* return res.status(400).json({
      message: "Controllare i dati inseriti",
      errors: validation.array(),
    }); */

    return next(
      new ValidationError("Controllare i dati inseriti", validation.array())
    );
  }

  const datiInIngresso = req.body;

  const newPizza = await prisma.pizza.create({
    data: {
      name: datiInIngresso.name,
      price: datiInIngresso.price,
      available: datiInIngresso.available,
      glutenFree: datiInIngresso.glutenFree,
      vegan: datiInIngresso.vegan,
      dettaglio: {
        create: {
          descrizione: datiInIngresso.description,
          image: datiInIngresso.image,
        },
      },
      ingredienti: {
        // si aspetta come valore un array di oggetti con la chiave id
        // [{id: 1}, {id: 2}, ....]
        connect: datiInIngresso.ingredients.map((idIngrediente) => ({
          id: +idIngrediente,
        })),
      },
    },
    // specifico i dati di quali relazioni includere nella risposta
    include: {
      dettaglio: true,
      ingredienti: {
        select: {
          id: true,
          name: true,
          gluten: true,
          vegan: true,
        },
      },
    },
  });

  return res.json(newPizza);
}

async function update(req, res, next) {
  const file = req.file;

  const id = req.params.id;
  const datiInIngresso = req.validateData;

  if (file) {
    datiInIngresso.image = file.filename;
  }

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
    data: {
      name: datiInIngresso.name,
      price: datiInIngresso.price,
      available: datiInIngresso.available,
      glutenFree: datiInIngresso.glutenFree,
      vegan: datiInIngresso.vegan,
      dettaglio: {
        upsert: {
          update: {
            descrizione: datiInIngresso.description,
            image: datiInIngresso.image,
          },
          create: {
            descrizione: datiInIngresso.description,
            image: datiInIngresso.image,
          },
          where: {
            pizzaId: parseInt(id),
          },
        },
      },
      ingredienti: {
        // si aspetta come valore un array di oggetti con la chiave id
        // [{id: 1}, {id: 2}, ....]
        connect: datiInIngresso.ingredients?.map((idIngrediente) => ({
          id: +idIngrediente,
        })),
      },
    },
    where: {
      id: parseInt(id),
    },
  });

  return res.json(pizzaAggiornata);
}

async function destroy(req, res) {
  /* await prisma.pizza.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      dettaglio: {
        disconnect: true,
      },
      recensioni: {
        disconnect: {
          id: 1,
        },
        deleteMany: {

        }
      },
      ingredienti: {
        disconnect: {
          id: 1,
        },
      }
    }
  }) */

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
