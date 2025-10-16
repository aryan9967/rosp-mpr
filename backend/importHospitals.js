import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import Hospital from './models/Hospital.js'; // Ensure the correct file extension

// MongoDB connection string
const mongoURI = 'mongodb+srv://atharvayadav11:ashokvaishali@cluster0.twnwnbu.mongodb.net/Database3?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI);

const db = mongoose.connection;

// Handle connection errors
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Once connected, process the CSV file
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Read CSV and insert data
    const stream = fs.createReadStream('data.csv').pipe(csv());

    for await (const row of stream) {
      try {
        const hospital = new Hospital({
          name: row['Hospital Name'],
          beds: {
            emergency: parseInt(row['Current Vacancies in Emergency Ward'], 10) || 0,
            icu: parseInt(row['ICU Beds'], 10) || 0,
            general: parseInt(row['General Ward'], 10) || 0,
          },
          services: row['Currently Active Services']
            ? row['Currently Active Services'].split(',').map((s) => s.trim())
            : [],
        });

        await hospital.save();
        console.log(`Saved hospital: ${row['Hospital Name']}`);
      } catch (err) {
        console.error(`Error saving hospital ${row['Hospital Name']}:`, err);
      }
    }

    console.log('CSV file successfully processed');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error processing CSV:', err);
    mongoose.connection.close();
  }
});
