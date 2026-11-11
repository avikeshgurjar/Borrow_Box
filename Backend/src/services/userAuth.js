const  prisma  = require('../configs/db');
const { comparePass } = require('./password_hash');

const loginUser = async (email, password) => {

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await comparePass(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  return user;
};

module.exports = loginUser;