const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")
const { config } = require("dotenv")

config();

const  pg_adapter= new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});


const prisma = new PrismaClient({
  adapter: pg_adapter,
});

module.exports =  prisma ;