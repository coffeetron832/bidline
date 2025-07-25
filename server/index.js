// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();
const app = express();

// Middleware JSON
app.use(express.json());

// API
app.use('/api/videos', videoRoutes);

// Archivos subidos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Sirve todo el frontend desde client/
const clientPath = path.resolve(__dirname, '../client');
app.use(express.static(clientPath));

// Sirve index tanto en "/" como en "/index.html"
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Fallback para cualquier otra ruta (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Conexión a MongoDB y arranque
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });
