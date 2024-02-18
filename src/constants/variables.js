export const queryAll = ["*"];

export const queryColumnOfUser = ["ho_ten", "email", "tuoi", "anh_dai_dien", "ngay_sinh"];

export const queryColumnOfUserByAnotherTable = [
  ...queryAll,
  "nguoi_dung.ho_ten",
  "nguoi_dung.email",
  "nguoi_dung.tuoi",
  "nguoi_dung.anh_dai_dien",
  "nguoi_dung.ngay_sinh",
];

export const queryColumnOfUserOfImageByAnotherTable = [
  ...queryAll,
  "hinh_anh",
  "hinh_anh.nguoi_dung.ho_ten",
  "hinh_anh.nguoi_dung.email",
  "hinh_anh.nguoi_dung.tuoi",
  "hinh_anh.nguoi_dung.anh_dai_dien",
  "hinh_anh.nguoi_dung.ngay_sinh",
];

export const queryColumnOfImage = [...queryColumnOfUserByAnotherTable];

export const queryColumnOfComment = [...queryColumnOfUserOfImageByAnotherTable, ...queryColumnOfUserByAnotherTable];
export const queryColumnOfSave = [...queryColumnOfComment];
