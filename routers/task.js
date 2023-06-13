// const express = require('express')
const express = require('express');
const router = express.Router();

// importer le contrôleur pour les utilisateurs
const TaskController  = require('../controllers/taskControllers')

// protection des routes 
const { protectRoute } = require('../middleware/auth');


// Route pour créer une tâche
router.post('/create', protectRoute, TaskController.createTask);

// Route protégée permettant d'afficher toutes les tâches
router.get('/', protectRoute, TaskController.getAllTasks);

// Route permettant d'afficher une tâche spécifique
router.get('/:id', protectRoute, TaskController.getOneTask);

// Route permettant de mettre à jour une tâche spécifique
router.put('/:id', protectRoute, TaskController.updateOneTask);

// Route permettant la suppression d'une tâche
router.delete('/:id', protectRoute, TaskController.deleteTask);


module.exports = router;