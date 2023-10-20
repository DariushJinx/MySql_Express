const createHttpError = require("http-errors");
const { getOneUser } = require("../controller/auth/auth.controller");
const JWT = require("jsonwebtoken");

function verifyAccessToken(req, res, next) {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    JWT.verify(token, "ACCESS_TOKEN_SECRET_KEY", async (err, payload) => {
      try {
        if (err) throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید");
        const { email } = payload || {};
        const user = await getOneUser(email);
        if (!user) throw createHttpError.Unauthorized("...وارد حساب کاربری خود شوید");
        req.user = user;
        return next();
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
}

const middleware = {
  verifyAccessToken,
};

module.exports = middleware;
