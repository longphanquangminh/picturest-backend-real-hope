import express from "express";
import { login, register } from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/register", register);

export default authRoute;
