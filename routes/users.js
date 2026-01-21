import express from "express";
import db from "../db.js";

const router = express.Router();

// 1. POST: Create a booking
router.post("/", async (req, res) => {
    const { email, session_id, date, time } = req.body; 
    try {
        await db.query(
            "INSERT INTO bookings (user_email, session_id, booking_date, booking_time, status) VALUES ($1, $2, $3, $4, 'Pending')",
            [email, session_id, date, time]
        );
        res.status(201).json({ message: "Booking created" });
    } catch (err) {
        console.error("DATABASE ERROR:", err.message); 
        res.status(500).json({ error: "Booking failed" });
    }
});

// 2. GET: Specific user bookings (For Client Dashboard)
router.get("/bookings/:email", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT b.*, s.name, s.price FROM bookings b JOIN sessions s ON b.session_id = s.id WHERE b.user_email = $1",
            [req.params.email]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error fetching bookings" });
    }
});

// 3. GET ALL: For Admin Dashboard (The Fix)
router.get("/bookings/all", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        b.id, 
        b.user_email, 
        b.booking_date, 
        b.booking_time, 
        b.status, 
        b.session_id,
        COALESCE(s.name, 'Unknown Session') as session_name 
       FROM bookings b 
       LEFT JOIN sessions s ON b.session_id = s.id 
       ORDER BY b.booking_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN ROUTE ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
});

export default router;