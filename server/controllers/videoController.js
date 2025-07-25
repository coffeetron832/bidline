// server/controllers/videoController.js
const Video = require('../models/Video');

const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const filename = req.file.filename;

    const video = new Video({ title, description, filename });
    await video.save();

    res.status(200).json({ message: 'Video enviado para revisión', video });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir el video' });
  }
};

const getApprovedVideos = async (req, res) => {
  try {
    const videos = await Video.find({ status: 'aprobado' }).sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los videos' });
  }
};

module.exports = { uploadVideo, getApprovedVideos };
