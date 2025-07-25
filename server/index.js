// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use('/api/videos', videoRoutes);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../client')));

// Ruta por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
