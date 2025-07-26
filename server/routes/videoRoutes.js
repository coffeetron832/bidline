// server/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/reviewQueue');
const auth = require('../middleware/auth');

const {
  uploadVideo,
  getApprovedVideos,
  getPendingVideos,
  updateVideoStatus,
  deleteVideoPermanently,
  removeRejectedVideo
} = require('../controllers/videoController');

// Subida de videos
router.post('/upload', auth, upload.single('video'), uploadVideo);

// Exploración pública
router.get('/explore', getApprovedVideos);

// Panel admin
router.get('/pending', auth, getPendingVideos);
router.put('/review/:id', auth, updateVideoStatus);

// 🔥 NUEVAS RUTAS
router.delete('/delete/:id', auth, deleteVideoPermanently);          // eliminar aprobado
router.delete('/removeRejected/:id', auth, removeRejectedVideo);     // quitar rechazado

module.exports = router;


