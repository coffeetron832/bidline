const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  cloudinary_url: { type: String, required: true },
  cloudinary_id: { type: String, required: true }, // 👈 NECESARIO para borrar en Cloudinary
  status: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente'
  },
  uploadedAt: { type: Date, default: Date.now },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Video', videoSchema);
