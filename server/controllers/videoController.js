// server/controllers/videoController.js
const Video = require('../models/Video');

const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validaciones básicas
    if (!title || !description || !req.file) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const filename = req.file.filename;

    // Asociar video con el usuario autenticado
    const video = new Video({
      title,
      description,
      filename,
      uploader: req.userId
    });

    await video.save();

    res.status(200).json({ message: 'Video enviado para revisión', video });
  } catch (err) {
    console.error('Error al subir el video:', err);
    res.status(500).json({ error: 'Error al subir el video' });
  }
};

const getApprovedVideos = async (req, res) => {
  try {
    const videos = await Video.find({ status: 'aprobado' })
      .sort({ uploadedAt: -1 })
      .populate('uploader', 'username'); // opcional: mostrar quién subió el video

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los videos' });
  }
};

const getPendingVideos = async (req, res) => {
  try {
    const videos = await Video.find({ status: 'pendiente' })
      .sort({ uploadedAt: -1 })
      .populate('uploader', 'username'); // opcional

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener videos pendientes' });
  }
};

const updateVideoStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['aprobado', 'rechazado'].includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const video = await Video.findByIdAndUpdate(id, { status }, { new: true });
    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el estado del video' });
  }
};

module.exports = {
  uploadVideo,
  getApprovedVideos,
  getPendingVideos,
  updateVideoStatus
};

