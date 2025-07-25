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

// Ver videos públicos
router.get('/explore', getApprovedVideos);

// Panel admin: videos pendientes
router.get('/pending', auth, getPendingVideos); // Mejor proteger esto

// Aprobar o rechazar video
router.put('/review/:id', auth, updateVideoStatus); // También protegido

module.exports = router;

