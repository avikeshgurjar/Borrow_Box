const { createProducts } = require("../services/addProductsService");

const createProductController = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const productsFiles= req.files

    const product = await createProducts(req.body, owner_id,productsFiles );

    if (!product) {
      return res.status(500).json({ error: "Failed to create product." });
    }

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error adding product",
      error: err.message,
    });
  }
};

module.exports = createProductController;
