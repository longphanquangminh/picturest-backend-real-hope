import express from "express";
import { getCommentsByPictureId, postComment } from "../controllers/binhLuanController.js";

const binhLuanRoutes = express.Router();

binhLuanRoutes.get("/:pictureId", getCommentsByPictureId);
binhLuanRoutes.post("/:pictureId", postComment);

export default binhLuanRoutes;
