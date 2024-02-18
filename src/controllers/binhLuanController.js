import { responseData } from "../config/Response.js";
import { getXataClient } from "../xata.js";
import dotenv from "dotenv";
import { queryColumnOfComment } from "../constants/variables.js";
import { decodeToken } from "../config/jwt.js";
dotenv.config();
const xata = getXataClient();

export const getCommentsByPictureId = async (request, response) => {
  try {
    const pictureId = request.params.pictureId;

    const picture = await xata.db.hinh_anh.filter({ $any: { id: pictureId } }).getFirst();

    if (!picture) {
      responseData(response, "Can't find image!", "", 400);
      return;
    }
    const comments = await xata.db.binh_luan.select(queryColumnOfComment).filter({ "hinh_anh.id": pictureId }).getMany();

    if (comments.length === 0) {
      responseData(response, "No comments!", [], 200);
      return;
    }
    responseData(response, "Success", comments, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const postComment = async (request, response) => {
  const pictureId = request.params.pictureId;

  const picture = await xata.db.hinh_anh.filter({ $any: { id: pictureId } }).getFirst();

  if (!picture) {
    responseData(response, "Can't find image!", "", 400);
    return;
  }

  const { noiDung } = request.body;

  if (!noiDung) {
    responseData(response, "No comment data!", "", 400);
    return;
  }

  const { token } = request.headers;

  if (!token || token == "" || token == null || token == undefined) {
    responseData(response, "Don't have token!", "", 400);
    return;
  }

  const accessToken = decodeToken(token);

  if (!accessToken.data?.nguoiDungId) {
    responseData(response, "Token is not valid!", "", 401);
    return;
  }

  const user = await xata.db.nguoi_dung
    .filter({
      id: String(accessToken.data.nguoiDungId),
    })
    .getFirst();

  if (!user) {
    responseData(response, "Can't auth user!", "", 401);
    return;
  }

  const userComment = {
    noi_dung: noiDung,
    ngay_binh_luan: new Date(),
    hinh_anh: picture.id,
    nguoi_dung: user.id,
  };

  await xata.db.binh_luan.create(userComment);
  responseData(response, "Comment successfully!", "", 200);
  return;
};
