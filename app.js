const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pizzasRouter = require("./routers/pizzas");
const ingredientsRouter = require("./routers/ingredients");
const reviewsRouter = require("./routers/reviews");
const authRouter = require("./routers/auth");
const errorsHandlerMiddleware = require("./middlewares/errorsHandler");
const routeNotFoundMiddleware = require("./middlewares/routeNotFound");

const app = express();
const port = 3005;

// Registro il middleware per la gestione del CORS
app.use(cors({
  origin: ["http://localhost:5173"],
}));

dotenv.config();

app.use(express.static("public"));

// Registro il middleware per il parsing del body
// Ogni volta che verranno inviati dei dati al server 
// con "Content-Type: application/json" verranno 
// automaticamente convertiti in un oggetto javascript
// accessibile tramite req.body
app.use(express.json());

// registro le rotte per le pizze
app.use("/pizzas", pizzasRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/reviews", reviewsRouter);
app.use("", authRouter) // registriamo le rotte senza alcun prefisso

// Registro il middleware per la gestione degli errori
app.use(errorsHandlerMiddleware);

// Registro il middleware per la gestione delle rotte non trovate
app.use(routeNotFoundMiddleware);



app.listen(port, () => {
  console.log(`App attiva su http://localhost:${port}`);
});
