import { responseData } from "../config/Response.js";
import { getXataClient } from "../xata.js";
import dotenv from "dotenv";
import { decodeToken } from "../config/jwt.js";
import { queryColumnOfImage } from "../constants/variables.js";

dotenv.config();
const xata = getXataClient();

export const getPictures = async (_, response) => {
  try {
    const data = await xata.db.hinh_anh.select(queryColumnOfImage).getMany();
    const count = await xata.db.hinh_anh.aggregate({
      totalCount: {
        count: "*",
      },
    });
    responseData(response, "Success", { count: count.aggs.totalCount, data }, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const getPicturesByName = async (request, response) => {
  try {
    const pictureName = request.params.pictureName;

    const data = await xata.db.hinh_anh
      .select(queryColumnOfImage)
      .filter({ $any: { ten_hinh: { $contains: pictureName } } })
      .getMany();
    const count = await xata.db.hinh_anh.aggregate({
      totalCount: {
        count: {
          filter: { $any: { ten_hinh: { $contains: pictureName } } },
        },
      },
    });

    responseData(response, "Success", { count: count.aggs.totalCount, data }, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const getPicturesById = async (request, response) => {
  try {
    const pictureId = request.params.pictureId;

    const picture = await xata.db.hinh_anh
      .select(queryColumnOfImage)
      .filter({ $any: { id: pictureId } })
      .getFirst();

    if (!picture) {
      responseData(response, "Can't find image!", "", 400);
      return;
    }
    // const countLove = await this.luuAnhRepository.count({ where: { hinh: { hinhId: +pictureId } } });
    // responseData(response, "Success", { savedCount: countLove, data: picture }, 200);
    responseData(response, "Success", { data: picture }, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const getCreatedPicturesByUser = async (request, response) => {
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

    const createdPictures = await xata.db.hinh_anh.select(queryColumnOfImage).filter({ "nguoi_dung.id": userId }).getMany();

    if (createdPictures.length === 0) {
      responseData(response, "User does not have any created pictures!", [], 200);
      return;
    }
    responseData(response, "Success", createdPictures, 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const deletePicture = async (request, response) => {
  try {
    const { pictureId } = request.params;
    const picture = await xata.db.hinh_anh
      .select(queryColumnOfImage)
      .filter({ $any: { id: pictureId } })
      .getFirst();
    if (!picture) {
      responseData(response, "Can't find image to delete!", "", 400);
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

    if (!user || accessToken.data.nguoiDungId !== picture.nguoi_dung.id) {
      responseData(response, "Token is not valid!", "", 401);
      return;
    }

    await xata.db.hinh_anh.delete(picture.id);
    responseData(response, "Delete successfully!", "", 200);
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};

export const postPicture = async (request, response) => {
  try {
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
    const file = request.file;

    if (!file) {
      // Handle missing file
      responseData(response, "Missing image file!", "", 400);
      return;
    }

    const { moTa, tenHinh } = request.body;
    if (!moTa) {
      responseData(response, "Missing image description!", "", 400);
      return;
    }
    if (!tenHinh) {
      responseData(response, "Missing image name!", "", 400);
      return;
    }
    const newPicture = {
      mo_ta: moTa,
      ten_hinh: tenHinh,
      duong_dan: file.filename,
      nguoi_dung: accessToken.data.nguoiDungId,
    };

    await xata.db.hinh_anh.create(newPicture);

    responseData(response, "Add image successfully!", file.filename, 200);
    return;
  } catch {
    responseData(response, "Error ...", "", 500);
  }
};
