import express from "express";
import db from "../db.js"; // Pointing to your db.js connection

const router = express.Router();

// Signup Route: localhost:5000/api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Check if user already exists
    const exists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) return res.status(400).json({ message: "User already exists" });

    // Insert new user
    const result = await db.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, password, role]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login Route: localhost:5000/api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;