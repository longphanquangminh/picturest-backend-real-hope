export const getImageNameAndType = fileUrl => {
  return fileUrl.split("/").pop();
};
