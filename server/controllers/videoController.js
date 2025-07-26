// server/controllers/videoController.js
const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video');

const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description || !req.file || !req.file.path || !req.file.filename) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const video = new Video({
      title,
      description,
      cloudinary_url: req.file.path,       // URL pública
      cloudinary_id: req.file.filename,    // ⚠️ Este es el public_id en Cloudinary
      uploader: req.user.id
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

// Eliminar video aprobado (de BD y de Cloudinary)
const deleteVideoPermanently = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    // Solo el autor puede eliminarlo
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Solo eliminar si fue aprobado
    if (video.status !== 'aprobado') {
      return res.status(400).json({ error: 'Solo se pueden eliminar videos aprobados desde aquí.' });
    }

    // Eliminar de Cloudinary
    if (video.cloudinary_id) {
      await cloudinary.uploader.destroy(video.cloudinary_id, { resource_type: 'video' });
    }

    await video.deleteOne();

    res.json({ message: 'Video eliminado permanentemente' });
  } catch (err) {
    console.error("Error al eliminar video aprobado:", err);
    res.status(500).json({ error: 'Error al eliminar video' });
  }
};

// Quitar video rechazado del perfil (solo elimina de BD)
const removeRejectedVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    // Solo el autor puede quitarlo
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Solo si está rechazado
    if (video.status !== 'rechazado') {
      return res.status(400).json({ error: 'Solo se pueden quitar videos rechazados desde aquí.' });
    }

    await video.deleteOne();

    res.json({ message: 'Video rechazado quitado del perfil' });
  } catch (err) {
    console.error("Error al quitar video rechazado:", err);
    res.status(500).json({ error: 'Error al quitar video' });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploader', 'username');
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });

    res.json(video);
  } catch (err) {
    console.error("Error al obtener video:", err);
    res.status(500).json({ error: 'Error al obtener el video' });
  }
};


module.exports = {
  uploadVideo,
  getApprovedVideos,
  getVideoById,
  getPendingVideos,
  updateVideoStatus,
  deleteVideoPermanently,
  removeRejectedVideo
};


