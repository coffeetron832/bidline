// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  // 1) Intentar obtener el token desde el header Authorization
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // 2) Si no viene en header, buscar en cookies
  if (!token && req.cookies) {
    token = req.cookies.token;
  }
  // 3) Si aún no hay token, error
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Carga completo desde DB para asegurarnos de tener notifications, createdAt, etc.
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    req.user = user;
    next();
  } catch (err) {
    console.error('Error verifyToken:', err);
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = verifyToken;
