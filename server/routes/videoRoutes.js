// server/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/reviewQueue');
const {
  uploadVideo,
  getApprovedVideos,
  getPendingVideos,
  updateVideoStatus
} = require('../controllers/videoController');

router.post('/upload', upload.single('video'), uploadVideo);
router.get('/explore', getApprovedVideos);
router.get('/pending', getPendingVideos); // Ruta para panel admin
router.put('/review/:id', updateVideoStatus); // Cambiar estado del video

module.exports = router;
