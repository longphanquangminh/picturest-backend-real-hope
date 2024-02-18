import { responseData } from "../config/Response.js";
import { getXataClient } from "../xata.js";
import dotenv from "dotenv";
import { decodeToken } from "../config/jwt.js";
import { queryColumnOfSave } from "../constants/variables.js";

dotenv.config();
const xata = getXataClient();

export const checkImageSaved = async (request, response) => {
  try {
    const { pictureId } = request.params;

    const picture = await xata.db.hinh_anh.filter({ $any: { id: pictureId } }).getFirst();

    if (!picture) {
      responseData(response, "Can't find image!", "", 400);
      return;
    }

    const { token } = request.headers;

    if (!token || token == "" || token == null || token == undefined) {
      responseData(response, "Don't have token!", "", 400);
      return;
    }

    const accessToken = decodeToken(token);

    const user = await xata.db.nguoi_dung
      .filter({
        id: String(accessToken.data.nguoiDungId),
      })
      .getFirst();

    if (!user) {
      responseData(response, "Token is not valid!", "", 401);
      return;
    }

    const checkPicture = await xata.db.luu_anh.filter({ "nguoi_dung.id": accessToken.data.nguoiDungId, "hinh_anh.id": pictureId }).getFirst();

    if (!checkPicture) {
      responseData(
        response,
        "User has not saved the picture yet!",
        {
          saved: false,
        },
        200,
      );
      return;
    }
    responseData(
      response,
      "User has saved the picture!",
      {
        saved: true,
      },
      200,
    );
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const postSave = async (request, response) => {
  const { pictureId } = request.params;

  const picture = await xata.db.hinh_anh.filter({ $any: { id: pictureId } }).getFirst();

  if (!picture) {
    responseData(response, "Can't find image!", "", 400);
    return;
  }

  const { token } = request.headers;

  if (!token || token == "" || token == null || token == undefined) {
    responseData(response, "Don't have token!", "", 400);
    return;
  }

  const accessToken = decodeToken(token);

  const user = await xata.db.nguoi_dung
    .filter({
      id: String(accessToken.data.nguoiDungId),
    })
    .getFirst();

  if (!user) {
    responseData(response, "Token is not valid!", "", 401);
    return;
  }

  const checkPicture = await xata.db.luu_anh.filter({ "nguoi_dung.id": accessToken.data.nguoiDungId, "hinh_anh.id": pictureId }).getFirst();

  if (!checkPicture) {
    const userSavePic = {
      ngay_luu: new Date(),
      hinh_anh: picture.id,
      nguoi_dung: user.id,
    };

    await xata.db.luu_anh.create(userSavePic);
    responseData(response, "Saved image!", "", 200);
    return;
  }
  await xata.db.luu_anh.delete(checkPicture.id);
  responseData(response, "Remove image from save collection!", "", 200);
};

export const getSavedPicturesByUser = async (request, response) => {
  try {
    const userId = request.params.userId;

    const user = await xata.db.nguoi_dung
      .filter({
        id: userId,
      })
      .getFirst();

    if (!user) {
      responseData(response, "User does not exist!", "", 400);
      return;
    }

    const savedPictures = await xata.db.luu_anh.select(queryColumnOfSave).filter({ "nguoi_dung.id": userId }).getFirst();

    if (savedPictures.length === 0) {
      responseData(response, "User does not have any saved pictures!", [], 200);
      return;
    }
    responseData(response, "Success", savedPictures, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};
