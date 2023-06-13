const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Fonction pour générer un token JWT
const generateAuthToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  console.log(token);
  return token;
};

// Middleware pour protéger les routes sensibles
const protectRoute = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header && header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = { generateAuthToken, protectRoute };