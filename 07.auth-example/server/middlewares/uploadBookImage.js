const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "books",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit", quality: "auto" }],
  }
});

const uploadBookImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadBookImage;