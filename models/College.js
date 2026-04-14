const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  short: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  type: [{ type: String, required: true }],
  rating: { type: Number, min: 0, max: 5, required: true },
  naac: { type: String, required: true },
  fees: { type: Number, min: 0, required: true },
  established: { type: Number, required: true },
  affiliation: { type: String, required: true },
  courses: [{ type: String, required: true }],
  about: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  website: { type: String, required: true },
  color: { type: String, required: true },
  bg: { type: String, required: true }
}, { timestamps: true });

collegeSchema.index({ name: 'text', location: 'text', state: 'text' });

module.exports = mongoose.model('College', collegeSchema);