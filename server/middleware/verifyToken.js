// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    req.user = user; // lo dejamos disponible para la ruta
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = verifyToken;
