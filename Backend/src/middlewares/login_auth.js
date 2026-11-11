const  prisma  = require('../configs/db')


const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    res.status(500).json({ message: "Authentication error" });
  }
};

module.exports = { authMiddleware };


