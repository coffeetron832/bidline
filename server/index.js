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

// Rutas de API
app.use('/api/videos', videoRoutes);

// Ruta estática para videos subidos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ✅ Servir frontend desde la carpeta client
const clientPath = path.resolve(__dirname, '../client');
console.log('📂 Sirviendo archivos estáticos desde:', clientPath);
app.use(express.static(clientPath));

// ✅ Fallback para cualquier otra ruta: sirve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Conexión y arranque del servidor
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });
