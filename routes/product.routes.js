const {
  addProduct,
  getListOfProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product/product.controller");

const productRoutes = require("express").Router();

productRoutes.post("/add", addProduct);

productRoutes.get("/list", getListOfProducts);

productRoutes.get("/:productId", getOneProduct);

productRoutes.patch("/:productId", updateProduct);

productRoutes.delete("/:productId", deleteProduct);

module.exports = productRoutes;
