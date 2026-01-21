import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// GET all sessions for the client and admin
router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM sessions ORDER BY id");
  res.json(result.rows);
});

// POST a new session (Admin only)
router.post("/", adminAuth, async (req, res) => {
  const { name, price, description, duration, image_url } = req.body;
  const result = await db.query(
    "INSERT INTO sessions (name, price, description, duration, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, price, description, duration, image_url]
  );
  res.status(201).json(result.rows[0]);
});

// DELETE a session (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  const result = await db.query("DELETE FROM sessions WHERE id = $1 RETURNING *", [req.params.id]);
  result.rows.length > 0
    ? res.json({ deleted: result.rows[0] })
    : res.status(404).json({ message: "Session not found" });
});
// Update a session (Admin Only)
router.put("/:id", adminAuth, async (req, res) => {
  const { name, price, description } = req.body;
  const adminRole = req.headers["x-role"]; // Security check

  if (adminRole !== "admin") {
    return res.status(403).json({ error: "Unauthorized: Admin access required" });
  }

  try {
    const result = await db.query(
      "UPDATE sessions SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *",
      [name, price, description, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Session updated successfully", session: result.rows[0] });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;