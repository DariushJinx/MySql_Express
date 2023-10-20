const { register, login, getProfile } = require("../controller/auth/auth.controller");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken.middleware");

const userRoutes = require("express").Router();

userRoutes.post("/register", register);

userRoutes.post("/login", login);

userRoutes.get("/:userID", verifyAccessToken, getProfile);

module.exports = userRoutes;
