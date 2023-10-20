const express = require("express");
const cors = require("cors");
const { notFound, errors } = require("./utils/erroHandler.utils");
const mainRoutes = require("./routes/main.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRoutes);

app.use((req, res, next) => {
  notFound(res);
});
app.use((error, req, res, next) => {
  errors(error, res);
});
app.listen(3000);
