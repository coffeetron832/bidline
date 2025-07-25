// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser'); // ← AÑADIDO

const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // ← NECESARIO para leer cookies

// Rutas API
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes);
app.use(cookieParser());


// Archivos subidos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Frontend
const clientPath = path.join(process.cwd(), 'client');
console.log('📂 Sirviendo archivos estáticos desde:', clientPath);
app.use(express.static(clientPath));

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Conexión MongoDB y arranque
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

