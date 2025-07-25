// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  // 🔑 Buscar el token en las cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    req.user = user; // deja el usuario en la request
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = verifyToken;
