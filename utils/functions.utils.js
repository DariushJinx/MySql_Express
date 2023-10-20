const JWT = require("jsonwebtoken");

const generateJwtToken = (user) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      email: user.email,
    };
    const options = {
      expiresIn: "1d",
    };
    JWT.sign(payload, "ACCESS_TOKEN_SECRET_KEY", options, (err, token) => {
      if (err) reject(createError.InternalServerError("خطای سروری"));
      resolve(token);
    });
  });
};

module.exports = generateJwtToken;
