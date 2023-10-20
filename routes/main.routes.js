const productRoutes = require("./product.routes");
const storeRoutes = require("./store.routes");
const userRoutes = require("./user.routes");

const mainRoutes = require("express").Router();

mainRoutes.use("/user", userRoutes);
mainRoutes.use("/product", productRoutes);
mainRoutes.use("/store", storeRoutes);

module.exports = mainRoutes;
