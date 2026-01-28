import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/sessions.js";
import userRoutes from "./routes/users.js";
import bookingsRoutes from "./routes/bookings.js";
import db from './db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Booking System API");
});

db.connect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});