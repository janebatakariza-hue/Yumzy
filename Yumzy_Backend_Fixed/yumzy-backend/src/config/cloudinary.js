const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage factory for different upload folders
const makeStorage = (folder, allowedFormats = ["jpg", "jpeg", "png", "webp"]) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder:          `yumzy/${folder}`,
      allowed_formats: allowedFormats,
      transformation:  [{ quality: "auto", fetch_format: "auto" }],
    },
  });

const uploadRestaurantLogo  = multer({ storage: makeStorage("restaurants/logos"),  limits: { fileSize: 5  * 1024 * 1024 } });
const uploadRestaurantCover = multer({ storage: makeStorage("restaurants/covers"), limits: { fileSize: 10 * 1024 * 1024 } });
const uploadMenuItem        = multer({ storage: makeStorage("menu-items"),         limits: { fileSize: 5  * 1024 * 1024 } });
const uploadAvatar          = multer({ storage: makeStorage("avatars"),            limits: { fileSize: 3  * 1024 * 1024 } });

module.exports = { cloudinary, uploadRestaurantLogo, uploadRestaurantCover, uploadMenuItem, uploadAvatar };
