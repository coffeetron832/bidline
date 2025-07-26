// server/middleware/reviewQueue.js
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validTypes = ['video/mp4', 'video/webm'];
    if (validTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de archivo no permitido'));
  }
});

module.exports = upload;
