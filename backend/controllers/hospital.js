const Hospital = require('../models/Hospital');

exports.getHospitalByName = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ name: req.params.name });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};