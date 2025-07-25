// server/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/reviewQueue');
const auth = require('../middleware/auth');

const {
  uploadVideo,
  getApprovedVideos,
  getPendingVideos,
  updateVideoStatus
} = require('../controllers/videoController');

// Solo usuarios autenticados pueden subir videos
router.post('/upload', auth, upload.single('video'), uploadVideo);
router.post('/upload', upload.single('video'), uploadVideo);
router.get('/explore', getApprovedVideos);
router.get('/pending', getPendingVideos); // Ruta para panel admin
router.put('/review/:id', updateVideoStatus); // Cambiar estado del video


module.exports = router;
