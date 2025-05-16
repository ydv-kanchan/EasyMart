const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const signupRouter = require("./routes/signup");
const verifyRoutes = require("./routes/verify");
const loginRouter = require("./routes/login");
// const protectedRoutes = require("./routes/protected");
const logoutRoute = require("./routes/logout");
const profileRoutes = require("./routes/profile");
const vendorProductRouter = require("./routes/vendorProducts");
const forgetPasswordRoutes = require("./routes/forgotPassword");
const changePasswordRoute = require("./routes/changePassword");
const customerProductRouter = require("./routes/customerProducts");
const wishlistRouter = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cart");
const shopDetailsRouter = require("./routes/shopDetails");
const ordersRouter = require("./routes/orders");
const vendorOrdersRouter = require("./routes/vendorOrders");

const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/signup", signupRouter);
app.use("/api/verify", verifyRoutes);
app.use("/api/login", loginRouter);
// app.use("/api", protectedRoutes);
app.use("/", logoutRoute);
app.use("/api/profile", profileRoutes);
app.use("/api/vendorProducts", vendorProductRouter);
app.use("/api", forgetPasswordRoutes);
app.use("/api/", changePasswordRoute);
app.use("/api/customerProducts", customerProductRouter);
app.use("/api/wishlistRoutes", wishlistRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/shopDetails", shopDetailsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/vendorOrders",vendorOrdersRouter);
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
