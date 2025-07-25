// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Video = require('../models/Video');
const User = require('../models/User'); // <--- Importa el modelo de usuario

router.get('/perfil', verifyToken, async (req, res) => {
  try {
    // Consulta completa del usuario en DB
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Videos del usuario
    const videos = await Video.find({ uploader: user._id }).sort({ uploadedAt: -1 });

    res.json({
      user: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      videos,
      notifications: user.notifications || []
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener perfil del usuario' });
  }
});

module.exports = router;
