import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  beds: {
    emergency: { type: Number, default: 0 },
    icu: { type: Number, default: 0 },
    general: { type: Number, default: 0 },
  },
  services: [{ type: String }],
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
