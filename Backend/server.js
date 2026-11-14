const { config } = require('dotenv')
config();
const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');

const signupRoutes = require('./src/routes/signUp');
const loginRoutes = require('./src/routes/login')
const addProductsRouters = require("./src/routes/addProducts");
const dashboardRoutes = require("./src/routes/dashboard");
const productRoutes = require("./src/routes/products");
const borrowRoutes = require("./src/routes/borrows");







const port = Number(process.env.PORT) || 5000

app.use(cors({
  origin: process.env.FRONTEND_URL || `http://localhost:5173`,
  credentials: true
}));
app.use(cookieParser());

app.use(express.json())

app.use("/uploads", express.static(require("path").join(__dirname, "public/uploads")));



app.use('/api', signupRoutes,loginRoutes,addProductsRouters,dashboardRoutes,productRoutes,borrowRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})

module.exports = app;

