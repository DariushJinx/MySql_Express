const task = require("../../db/taskDB");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const createStore = (req, res, next) => {
  try {
    const body = req.body;
    const addQuery = `INSERT INTO store VALUES (NULL,"${body.name}","${body.address}",${body.phone},"${body.Registration_code}",${body.userID})`;
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

const getListOfStores = (req, res, next) => {
  try {
    let getQuery = `SELECT * FROM store`;
    task.query(getQuery, (err, results) => {
      if (!results.length) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          data: createHttpError.NotFound("فروشگاهی یافت نشد"),
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
          data: { stores: results },
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

const getOneStore = (req, res, next) => {
  try {
    const storeID = req.params.storeID;
    const getOneQuery = `SELECT * FROM store WHERE id = '${storeID}'`;
    task.query(getOneQuery, (err, results) => {
      if (!results[0]) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          data: createHttpError.NotFound("فروشگاه مورد نظر یافت نشد"),
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
          data: { store: results[0] },
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateStore = (req, res, next) => {
  try {
    const updates = [];
    const storeID = req.params.storeID;
    const body = req.body;

    if (body.name) {
      updates.push(`name = '${body.name}'`);
    }
    if (body.address) {
      updates.push(`address ='${body.address}'`);
    }

    if (body.phone) {
      updates.push(`phone = '${body.phone}'`);
    }
    if (body.Registration_code) {
      updates.push(`Registration_code = '${body.Registration_code}'`);
    }
    const updateQuery = `UPDATE store Set ${updates.join(", ")} WHERE id = '${storeID}'`;
    task.query(updateQuery, async (err, results) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        const store = await getOneStoreByName(storeID);
        if (results.affectedRows) {
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: store,
          });
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const getOneStoreByName = (id) => {
  return new Promise((resolve, reject) => {
    const getQuery = `SELECT * FROM store WHERE id= ?`;
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

const deleteStore = (req, res, next) => {
  try {
    const storeID = req.params.storeID;
    const deleteQuery = `DELETE FROM store WHERE id = '${storeID}'`;
    task.query(deleteQuery, (err, results) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { message: "delete store successfully..." },
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

const store = {
  createStore,
  getListOfStores,
  getOneStore,
  updateStore,
  deleteStore,
};

module.exports = store;
