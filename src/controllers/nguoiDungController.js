import { responseData } from "../config/Response.js";
import { decodeToken } from "../config/jwt.js";
import { queryColumnOfUser } from "../constants/variables.js";
import { getXataClient } from "../xata.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const xata = getXataClient();

export const findUser = async (request, response) => {
  try {
    const userId = request.params.userId;

    const user = await xata.db.nguoi_dung
      .select(queryColumnOfUser)
      .filter({
        id: userId,
      })
      .getFirst();

    if (!user) {
      responseData(response, "Can't find user!", "", 400);
      return;
    }
    responseData(response, "Success!", user, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const editUserInfo = async (request, response) => {
  try {
    const userId = request.params.userId;

    const checkUser = await xata.db.nguoi_dung
      .filter({
        id: userId,
      })
      .getFirst();

    if (!checkUser) {
      responseData(response, "Can't find user!", "", 400);
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

    if (!user || accessToken.data.nguoiDungId !== userId) {
      responseData(response, "Token is not valid!", "", 401);
      return;
    }

    // initial info for updating
    const updateFields = {
      email: user.email,
    };

    const { tuoi, matKhau, hoTen, email } = request.body;
    if (email) {
      const checkUserEmail = await xata.db.nguoi_dung
        .filter({
          email,
          $not: {
            id: userId,
          },
        })
        .getFirst();
      if (checkUserEmail && checkUserEmail.nguoiDungId !== userId) {
        responseData(response, "Email has been already used!", "", 400);
        return;
      }
      updateFields.email = email;
    }

    const file = request.file;

    if (file) {
      updateFields.anh_dai_dien = file.filename;
    }

    if (tuoi) {
      if (isNaN(tuoi) || !Number.isInteger(tuoi) || tuoi < 15) {
        responseData(response, "Age must be a integer and higher than 14!", "", 400);
        return;
      }
      updateFields.tuoi = tuoi;
    }

    if (matKhau) {
      updateFields.mat_khau = matKhau;
    }

    if (hoTen) {
      updateFields.ho_ten = hoTen;
    }

    if (matKhau) {
      updateFields.mat_khau = bcrypt.hashSync(matKhau, 10);
    }

    await xata.db.nguoi_dung.update(accessToken.data.nguoiDungId, updateFields);
    responseData(response, "Update info successfully!", "", 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};
export const editUserAvatar = async (request, response) => {
  try {
    const userId = request.params.userId;

    const checkUser = await xata.db.nguoi_dung
      .filter({
        id: userId,
      })
      .getFirst();

    if (!checkUser) {
      responseData(response, "Can't find user!", "", 400);
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

    if (!user || accessToken.data.nguoiDungId !== userId) {
      responseData(response, "Token is not valid!", "", 401);
      return;
    }

    const file = request.file;

    const updateFields = {
      anh_dai_dien: user.anhDaiDien,
    };

    if (file) {
      updateFields.anh_dai_dien = file.filename;
    }

    await xata.db.nguoi_dung.update(accessToken.data.nguoiDungId, updateFields);
    responseData(response, "Update avatar successfully!", updateFields, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};
