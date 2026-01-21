import express from "express";
import db from "../db.js";

const router = express.Router();

// CREATE booking (Client)
router.post("/", async (req, res) => {
  const { email, session_id, date, time } = req.body;

  try {
    await db.query(
      `INSERT INTO bookings 
       (user_email, session_id, booking_date, booking_time, status) 
       VALUES ($1, $2, $3, $4, 'Pending')`,
      [email, session_id, date, time]
    );
    res.status(201).json({ message: "Booking created" });
  } catch (err) {
    console.error("BOOKING ERROR:", err.message);
    res.status(500).json({ error: "Booking failed" });
  }
});

// GET bookings for specific user
router.get("/user/:email", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.*, s.name 
       FROM bookings b 
       JOIN sessions s ON b.session_id = s.id 
       WHERE b.user_email = $1`,
      [req.params.email]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// GET all bookings (Admin)
router.get("/all", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        b.id,
        b.user_email,
        b.booking_date,
        b.booking_time,
        b.status,
        COALESCE(s.name, 'Unknown Session') AS session_name
       FROM bookings b
       LEFT JOIN sessions s ON b.session_id = s.id
       ORDER BY b.booking_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
});

// UPDATE booking status (Admin only)
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const role = req.headers["x-role"];

  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {
    const result = await db.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err.message);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

export default router;
