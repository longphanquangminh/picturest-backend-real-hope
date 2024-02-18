import express from "express";
import { findUser, editUserInfo, editUserAvatar } from "../controllers/nguoiDungController.js";
import upload from "../config/upload.js";

const nguoiDungRoutes = express.Router();

nguoiDungRoutes.get("/:userId", findUser);
nguoiDungRoutes.put("/:userId", upload.single("file"), editUserInfo);
nguoiDungRoutes.post("/avatar/:userId", upload.single("file"), editUserAvatar);

export default nguoiDungRoutes;
