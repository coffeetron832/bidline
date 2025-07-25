// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Video = require('../models/Video');

router.get('/perfil', verifyToken, async (req, res) => {
  try {
    const user = req.user;

    // Buscar los videos subidos por el usuario
    const videos = await Video.find({ uploader: user._id }).sort({ uploadedAt: -1 });

    // Usamos un sistema de notificaciones embebido en el usuario
    const notifications = user.notifications || [];

    res.json({
      user: {
        name: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      videos,
      notifications
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener perfil del usuario' });
  }
});

module.exports = router;
