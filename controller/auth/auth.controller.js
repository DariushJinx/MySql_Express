const task = require("../../db/taskDB");
const { hash, compare } = require("bcrypt");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const generateJwtToken = require("../../utils/functions.utils");
const { emailPattern } = require("../../utils/config");

async function register(req, res, next) {
  try {
    const body = req.body;
    const emailValidate = body.email.match(emailPattern);

    if (!emailValidate) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        data: createHttpError.BadRequest("فرمت ایمیل وارد شده صحیح نمی باشد"),
      });
    }

    const hashPassword = await hash(body.password, 10);

    if (body.user_type === "seller" && body.store_address === "") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        data: createHttpError.BadRequest("فروشنده ملزم به وارد کردن آدرس فروشگاه می باشد"),
      });
    } else if (body.user_type === "user" && body.store_address.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        data: createHttpError.BadRequest("کاربر عادی قادر به اضافه کردن آدرس فروشگاه نمی باشد"),
      });
    }

    const registerQuery = `INSERT INTO users VALUES (NULL,"${body.first_name}","${body.last_name}","${hashPassword}",${body.phone},"${emailValidate}","${body.store_address}","${body.user_type}")`;

    const user = await getOneUser(emailValidate);
    if (user) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        data: createHttpError.BadRequest("کاربر مورد نظر از قبل وجود دارد"),
      });
    } else {
      task.query(registerQuery, async (err, result) => {
        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            data: createHttpError.InternalServerError("خطای سرور"),
          });
        } else {
          if (result.affectedRows) {
            return res.status(HttpStatus.CREATED).json({
              statusCode: HttpStatus.CREATED,
              data: req.body,
            });
          }
        }
      });
    }
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const body = req.body;
    const emailValidate = body.email.match(emailPattern);
    const getUser = `SELECT * FROM users WHERE first_name = "${body.first_name}" AND email = "${emailValidate}"`;
    task.query(getUser, async (err, result) => {
      const { password, ...data } = result[0];
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        if (!result[0]) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode: HttpStatus.UNAUTHORIZED,
            data: {
              message: "کاربری با این ایمیل و یا یوزرنیم یافت نشد",
            },
          });
        }

        const isPasswordValid = await compare(body.password, result[0].password);

        if (!isPasswordValid) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode: HttpStatus.UNAUTHORIZED,
            data: {
              message: "رمز عبور وارد شده صحیح نمی باشد",
            },
          });
        }

        const token =await generateJwtToken(data);
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          user: {
            ...data,
            token,
          },
        });
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const userID = req.params.userID;
    const getProfileQuery = `SELECT * FROM users WHERE id = '${userID}'`;
    task.query(getProfileQuery, (err, result) => {
      const { password, ...data } = result[0];
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: createHttpError.InternalServerError("خطای سرور"),
        });
      } else {
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          user: data,
        });
      }
    });
  } catch (err) {
    next(err);
  }
}

function getOneUser(email) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    task.query(query, [email], (err, results) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(results[0]);
      }
    });
  });
}

const auth = {
  register,
  login,
  getProfile,
  getOneUser,
};

module.exports = auth;
