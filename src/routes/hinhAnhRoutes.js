import express from "express";
import {
  getPictures,
  getPicturesByName,
  getPicturesById,
  getCreatedPicturesByUser,
  deletePicture,
  postPicture,
} from "../controllers/hinhAnhController.js";
import upload from "../config/upload.js";

const hinhAnhRoutes = express.Router();

hinhAnhRoutes.get("/", getPictures);
hinhAnhRoutes.get("/search-by-name/:pictureName", getPicturesByName);
hinhAnhRoutes.get("/:pictureId", getPicturesById);
hinhAnhRoutes.get("/created-by-user/:userId", getCreatedPicturesByUser);
hinhAnhRoutes.delete("/:pictureId", deletePicture);
hinhAnhRoutes.post("/", upload.single("file"), postPicture);

export default hinhAnhRoutes;
