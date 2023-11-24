const express = require("express");
const dotenv = require("dotenv");
const pizzasRouter = require("./routers/pizzas");
const errorsHandlerMiddleware = require("./middlewares/errorsHandler");
const routeNotFoundMiddleware = require("./middlewares/routeNotFound");

const app = express();
const port = 3000;

dotenv.config();

// Registro il middleware per il parsing del body
// Ogni volta che verranno inviati dei dati al server 
// con "Content-Type: application/json" verranno 
// automaticamente convertiti in un oggetto javascript
// accessibile tramite req.body
app.use(express.json());

// registro le rotte per le pizze
app.use("/pizzas", pizzasRouter);

// Registro il middleware per la gestione delle rotte non trovate
app.use(routeNotFoundMiddleware);

// Registro il middleware per la gestione degli errori
app.use(errorsHandlerMiddleware);

app.listen(port, () => {
  console.log(`App attiva su http://localhost:${port}`);
});
