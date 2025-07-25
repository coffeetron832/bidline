// server/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/reviewQueue');
const { uploadVideo, getApprovedVideos } = require('../controllers/videoController');

router.post('/upload', upload.single('video'), uploadVideo);
router.get('/explore', getApprovedVideos);

module.exports = router;
