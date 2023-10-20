const task = require("../../db/taskDB");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const addProduct = (req, res, next) => {
  try {
    const body = req.body;
    const addQuery = `INSERT INTO products VALUES (NULL,"${body.name}","${body.price}","${body.number_of_inventory}","${body.description}","${body.storeID}")`;
    task.query(addQuery, (err, results) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        if (results.affectedRows) {
          return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            data: req.body,
          });
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const getListOfProducts = (req, res, next) => {
  try {
    let getQuery = `SELECT * FROM products`;
    task.query(getQuery, (err, results) => {
      if (!results.length) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          data: createHttpError.NotFound("محصولی یافت نشد"),
        });
      }
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { products: results },
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

const getOneProduct = (req, res, next) => {
  try {
    const productId = req.params.productId;
    const getOneQuery = `SELECT * FROM products WHERE id=${productId}`;
    task.query(getOneQuery, (err, results) => {
      if (!results[0]) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          data: createHttpError.NotFound("محصول مورد نظر یافت نشد"),
        });
      }
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { product: results[0] },
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = (req, res, next) => {
  try {
    const updates = [];
    const productId = req.params.productId;
    const body = req.body;

    if (body.name) {
      updates.push(`name = '${body.name}'`);
    }
    if (body.price) {
      updates.push(`price ='${body.price}'`);
    }
    if (body.number_of_inventory) {
      updates.push(`number_of_inventory = '${body.number_of_inventory}'`);
    }
    if (body.description) {
      updates.push(`description = '${body.description}'`);
    }
    const updateQuery = `UPDATE products Set ${updates.join(", ")} WHERE id = '${productId}'`;
    task.query(updateQuery, async (err, results) => {
      const product = await getOneProductByName(productId);
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        if (results.affectedRows) {
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: product,
          });
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const getOneProductByName = (id) => {
  return new Promise((resolve, reject) => {
    const getQuery = `SELECT * FROM products WHERE id= ?`;
    task.query(getQuery, [id], (err, results) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(results[0]);
      }
    });
  });
};

const deleteProduct = (req, res, next) => {
  try {
    const productId = req.params.productId;
    const deleteQuery = `DELETE FROM products WHERE id="${productId}"`;
    task.query(deleteQuery, (err, results) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        if (results.affectedRows) {
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: { message: "delete product successfully..." },
          });
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const product = {
  addProduct,
  getListOfProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};

module.exports = product;
