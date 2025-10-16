import express from 'express';
import Hospital from '../models/Hospital.js'; // Ensure the correct file extension

const router = express.Router();

// Fetch all hospitals from the database
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
