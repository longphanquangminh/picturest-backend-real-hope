import { responseData } from "../config/Response.js";
import { getXataClient } from "../xata.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { createToken } from "../config/jwt.js";
import { queryColumnOfUser } from "../constants/variables.js";

dotenv.config();
const xata = getXataClient();

export const register = async (request, response) => {
  try {
    const { tuoi, matKhau, hoTen, email } = request.body;

    if (!email) {
      responseData(response, "Please type email!", "", 400);
      return;
    }

    const checkUser = await xata.db.nguoi_dung
      .filter({
        email,
      })
      .getFirst();
    if (checkUser) {
      responseData(response, "Email already exist!", "", 400);
      return;
    }
    if (!matKhau) {
      responseData(response, "Please type password!", "", 400);
      return;
    }
    if (!hoTen) {
      responseData(response, "Please type your full name!", "", 400);
      return;
    }

    await xata.db.nguoi_dung.create({
      ho_ten: hoTen,
      email,
      tuoi: 15,
      anh_dai_dien: null,
      mat_khau: bcrypt.hashSync(matKhau, 10),
    });

    responseData(response, "Register successfully!", "", 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const login = async (request, response) => {
  try {
    const { email, matKhau } = request.body;
    if (!email) {
      responseData(response, "Please type email!", "", 400);
      return;
    }
    if (!matKhau) {
      responseData(response, "Please type password!", "", 400);
      return;
    }
    const checkUser = await xata.db.nguoi_dung
      .filter({
        email,
      })
      .getFirst();
    if (checkUser) {
      if (bcrypt.compareSync(matKhau, checkUser.mat_khau)) {
        const key = new Date().getTime();
        const token = createToken({
          nguoiDungId: checkUser.id,
          key,
        });
        const userData = await xata.db.nguoi_dung
          .select(queryColumnOfUser)
          .filter({
            email,
          })
          .getFirst();
        responseData(response, "Login successfully!", { token, userInfo: userData }, 200);
      } else {
        responseData(response, "Password is not correct!", "", 400);
      }
    } else {
      responseData(response, "Email does not exist!", "", 400);
    }
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};
