const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function store(req, res){
  const datiInIngresso = req.body;

  const newIngredient = await prisma.ingrediente.create({
    data: {
      name: datiInIngresso.name,
      gluten: datiInIngresso.gluten,
      vegan: datiInIngresso.vegan,
    }
  })

  return res.json(newIngredient);
}


module.exports = {
  store
}