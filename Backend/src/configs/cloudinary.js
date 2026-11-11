const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { config } = require("dotenv");

config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const absolutePath = path.resolve(localFilePath);

    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "auto",
      folder: "borrowbox",
    });

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    return response.secure_url;

  } catch (error) {
    const absolutePath = path.resolve(localFilePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

module.exports = uploadToCloudinary;
