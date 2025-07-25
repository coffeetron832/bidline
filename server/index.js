// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // ← Agrega esto
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();
const app = express();

// Middleware JSON
app.use(express.json());

// Rutas API
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes); 

// Archivos subidos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ─── Sirviendo frontend ──────────────────────────────────────────────────────────
// Usa process.cwd() para apuntar siempre a la raíz de tu proyecto
const clientPath = path.join(process.cwd(), 'client');
console.log('📂 Sirviendo archivos estáticos desde:', clientPath);
app.use(express.static(clientPath));

// Fallback para cualquier ruta: sirve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ─── Conexión a MongoDB y arranque ───────────────────────────────────────────────
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
