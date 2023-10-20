const { createStore, getListOfStores, getOneStore, updateStore, deleteStore } = require("../controller/sotre/store.controller");
const task = require("../db/taskDB");

const storeRoutes = require("express").Router();

storeRoutes.post("/create",createStore);

storeRoutes.get("/list", getListOfStores);

storeRoutes.get("/:storeID",getOneStore);

storeRoutes.patch("/:storeID", updateStore);

storeRoutes.delete("/:storeID", deleteStore);

module.exports = storeRoutes;
