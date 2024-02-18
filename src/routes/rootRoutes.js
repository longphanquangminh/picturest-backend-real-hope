import express from "express";
import authRoutes from "./authRoutes.js";
import nguoiDungRoutes from "./nguoiDungRoutes.js";
import hinhAnhRoutes from "./hinhAnhRoutes.js";
import binhLuanRoutes from "./binhLuanRoutes.js";
import luuAnhRoutes from "./luuAnhRoutes.js";

const rootRoute = express.Router();

rootRoute.use("/auth", authRoutes);
rootRoute.use("/users", nguoiDungRoutes);
rootRoute.use("/pictures", hinhAnhRoutes);
rootRoute.use("/comments", binhLuanRoutes);
rootRoute.use("/saved", luuAnhRoutes);

export default rootRoute;
