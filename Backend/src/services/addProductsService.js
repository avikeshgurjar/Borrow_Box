const prisma = require('../configs/db');
const uploadToCloudinary = require('../configs/cloudinary');

const createProducts = async (productsDetails, owner_id, files = []) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      maxBorrowDays,
    } = productsDetails;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        category,
        condition,
        maxBorrowDays: parseInt(maxBorrowDays),
        ownerId: owner_id,
      },
    });

    for (let i = 0; i < files.length; i++) {
      const localFilePath = files[i].path; 

      const imageUrl = await uploadToCloudinary(localFilePath); 

      await prisma.productImage.create({
        data: {
          url: imageUrl,
          thumbNail: i === 0,
          productId: product.id,
        },
      });
    }

    return product;

  } catch (err) {
    console.error(`Error while creating product: ${err.message}`);
    throw err;
  }
};

module.exports = { createProducts };
