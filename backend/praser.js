const fs = require('fs');
const csv = require('csv-parser');
const Hospital = require('./models/Hospital');

/**
 * Parse CSV file and import hospital data to MongoDB
 * 
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} - Array of imported hospitals
 */
const importHospitalsFromCSV = async (filePath) => {
  const hospitals = [];
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Process each row from CSV
          for (const row of results) {
            // Map CSV fields to hospital model
            const hospitalData = {
              name: row.HospitalName,
              address: row.Address,
              phone: row.Phone,
              email: row.Email,
              website: row.Website,
              beds: {
                emergency: {
                  total: parseInt(row.EmergencyBedsTotal) || 0,
                  available: parseInt(row.EmergencyBedsAvailable) || 0
                },
                icu: {
                  total: parseInt(row.ICUBedsTotal) || 0,
                  available: parseInt(row.ICUBedsAvailable) || 0
                },
                general: {
                  total: parseInt(row.GeneralBedsTotal) || 0,
                  available: parseInt(row.GeneralBedsAvailable) || 0
                }
              },
              services: row.Services ? row.Services.split(',').map(s => s.trim()) : [],
              surgeryTypes: row.SurgeryTypes ? row.SurgeryTypes.split(',').map(s => s.trim()) : [],
              scanTypes: row.ScanTypes ? row.ScanTypes.split(',').map(s => s.trim()) : []
            };
            
            // Use findOneAndUpdate to handle both inserts and updates
            const hospital = await Hospital.findOneAndUpdate(
              { name: hospitalData.name },
              hospitalData,
              { upsert: true, new: true }
            );
            
            hospitals.push(hospital);
          }
          
          resolve(hospitals);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = {
  importHospitalsFromCSV
};