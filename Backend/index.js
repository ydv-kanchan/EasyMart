const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const signupRouter = require("./routes/signup");
const verifyRoutes = require("./routes/verify");
const loginRouter = require("./routes/login");
const protectedRoutes = require("./routes/protected");
const logoutRoute = require("./routes/logout");
const profileRoutes = require("./routes/profile");
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

// Routes
app.use("/api/signup", signupRouter);
app.use("/api/verify", verifyRoutes); // ✅ still valid if needed
app.use("/api/login", loginRouter);
app.use("/api", protectedRoutes);
app.use("/", logoutRoute);
app.use("/api/profile", profileRoutes); 

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
