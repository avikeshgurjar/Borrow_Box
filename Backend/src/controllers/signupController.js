const createUser = require('../services/createUsers');

const registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Registration successful!",
      user: user
    });

  } catch (error) {

    if (error.code === "P2002") {
      const target = error.meta?.target || [];
      if (Array.isArray(target) && target.includes("enrollmentId")) {
        return res.status(400).json({
          error: "A user with this Enrollment ID already exists."
        });
      }
      return res.status(400).json({
        error: "A user with this email already exists."
      });
    }

    if (error.message === "All fields are required.") {
      return res.status(400).json({
        error: error.message
      });
    }

    console.log(`Error: ${error.message}`);

    res.status(500).json({
      error: "Server error."
    });
  }
};

module.exports = registerUser;