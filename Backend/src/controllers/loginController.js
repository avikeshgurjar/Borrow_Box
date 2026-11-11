const loginUser = require('../services/userAuth');

const validateUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required."
      });
    }

    const user = await loginUser(email, password);

    res.cookie("userId", user.id, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax"
    });

    res.status(200).json({
      message: "Login successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        enrollmentId: user.enrollmentId
      }
    });

  } catch (err) {

    if (err.message === "Invalid email or password.") {
      return res.status(401).json({
        error: err.message
      });
    }

    console.error("Login error:", err);

    res.status(500).json({
      error: "Server error during login."
    });
  }
};

module.exports = validateUser;