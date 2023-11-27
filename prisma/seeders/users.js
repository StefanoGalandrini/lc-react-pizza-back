const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const users = [
  {
    name: "Giuseppe Verdi",
    email: "beppe@gmail.com",
    password: "Password4567!",
  },
  {
    name: "Giulia Bianchi",
    email: "giulia@gmail.com",
    password: "Password890!",
  },
];

// Funzione IIFE che si auto invoca all'avvio del file
(async function () {
  await prisma.user.createMany({
    data: users.map((user) => {
      user.password = bcrypt.hashSync(user.password, 10);
      return user;
    }),
  });
})();
