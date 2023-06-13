// import { Task } from '../models/task.js';
const Task = require('../models/task');

// Controller pour créer une tâche
const createTask = async (req, res) => {
    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        completed: req.body.completed
    });

    try {
        await task.save();
        res.status(201).json({ message: 'La tâche a bien été crée !' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controller pour afficher toutes les tâches
const getAllTasks = async (req, res) => {
    Task.find()
        .then(tasks => {
            res.status(200).json(tasks)
        })
        .catch(error => res.status(500).json({ message: error.message }))
};

// Controller pour afficher une tâche spécifique
const getOneTask = async (req, res) => {
    try {
        const data = await Task.findById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller pour supprimer une tâche
const deleteTask = async (req, res) => {
    Task.deleteOne({
        where: {
            id: req.params.id
        }
    })
        .then(() => res.status(200).json({ message: 'Cette tâche a été supprimée avec succès !' }))
        .catch(error => res.status(400).json({ message: error.message }));
};

// Controller pour mettre à jour une tâche
const updateOneTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        // Récupération des données
        const { name, description, date, completed } = req.body;

        task.set({
            name: name,
            description: description,
            date: date,
            completed: completed,
        })

        task.save();

        // Envoi d'une réponse indiquant que les informations de l'utilisateur ont été sauvegardées
        res.status(204).json({ message: 'La tâche a été mis à jour avec succès !' })

    } catch (error) {
        // Gestion des erreurs
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};



module.exports = {
    createTask,
    getAllTasks,
    getOneTask,
    deleteTask,
    updateOneTask
}