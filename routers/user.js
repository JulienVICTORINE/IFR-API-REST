// const express = require('express')
const express = require('express');
const router = express.Router();

// importer le contrôleur pour les utilisateurs
const UserController = require('../controllers/userControllers');

// protection des routes 
const { protectRoute } = require('../middleware/auth.js');


// Route pour créer un utilisateur
router.post('/inscription', protectRoute, UserController.createUser);

// Route protégée permettant d'afficher tous les utilisateurs
router.get('/', protectRoute, UserController.getAllUser);

// Route permettant d'afficher un utilisateur spécifique
router.get('/:id', protectRoute, UserController.getOneUser);

// Route permettant de mettre à jour un utilisateur spécifique
router.put('/:id', protectRoute, UserController.updateOneUser);

// Route permettant la suppression d'un utilsiateur
router.delete('/:id', protectRoute, UserController.deleteOneUser);

// Route permettant la connexion d'utilisateur
router.post('/login', protectRoute, UserController.connectUser);


module.exports = router;