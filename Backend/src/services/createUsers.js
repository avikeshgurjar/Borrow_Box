const  prisma  = require('../configs/db');
const { hashPass } = require('./password_hash');

const createUser = async (userData) => {

  const {
    enrollmentId,
    name,
    email,
    password,
    phone
  } = userData;

  // console.log({
  //   enrollmentId,
  //   name,
  //   email,
  //   password,
  //   phone
  // });

  if (!enrollmentId || !name || !email || !password || !phone) {
    throw new Error("All fields are required.");
  }

  const hash_password = await hashPass(password);

  const user = await prisma.user.create({
    data: {
      enrollmentId,
      name,
      email,
      passwordHash: hash_password,
      phone
    }
  });

  return user;
};


module.exports = createUser;
