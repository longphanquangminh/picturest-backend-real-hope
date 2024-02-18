import express from "express";
import { checkImageSaved, postSave, getSavedPicturesByUser } from "../controllers/luuAnhController.js";

const luuAnhRoutes = express.Router();

luuAnhRoutes.get("/:pictureId", checkImageSaved);
luuAnhRoutes.post("/:pictureId", postSave);
luuAnhRoutes.get("/saved-by-user/:userId", getSavedPicturesByUser);

export default luuAnhRoutes;
