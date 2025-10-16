import express from 'express'
import axios from 'axios';
import { nearby_hospitals } from '../server.js';

const router = express.Router();

// Get nearby hospitals and fire brigades
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    // Get places from Google Maps API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          type,
          key: googleMapsApiKey
        }
      }
    );
    console.log(response.data.results)

    nearby_hospitals.nearby_hospitals.push(
        response.data.results.slice(0, 8).map(hospital => ({
          business_status: hospital.business_status,
          name: hospital.name,
          icon: hospital.icon,
          opening_hours: hospital.opening_hours?.open_now ?? null,  // Handles missing data safely
          rating: hospital.rating,
          vicinity: hospital.vicinity
        }))
      );
      
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
});

export default router;