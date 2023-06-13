const User = require('../models/user');
const json = require('body-parser/lib/types/json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { JWT_SECRET="jwt_secret" } = process.env;

const { generateAuthToken } = require('../middleware/auth');


// Controller pour la création d'un utilisateur
const createUser = async (req, res) => {
    // Création de l'utilisateur
    const user = new User({
        nom: req.body.nom,
        age: req.body.age,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password = await bcrypt.hash(req.body.password, 6)
    });

    try {
        await user.save();

        res.status(201).json({ message: 'L\'utilisateur a été créé avec succès !' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller pour afficher tous les utilisateurs
const getAllUser = async (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => res.status(500).json({ message: error.message }))
};

// Controller pour récupérer et afficher un utilisateur
const getOneUser = async (req, res) => {
    try {
        const data = await User.findById(req.params.id);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller pour supprimer un utilisateur
const deleteOneUser = async (req, res) => {
    User.deleteOne({
        where: {
            id: req.params.id
        }
    })
        .then(() => res.status(200).json({ message: 'L\'utilisateur a été supprimé avec succès !' }))
        .catch(error => res.status(400).json({ message: error.message }));
};

// Controller pour la mise à jour d'un utilisateur
const updateOneUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        // Récupération des données
        const { nom, age, email, username, password } = req.body;

        user.set({
            nom: nom,
            age: age,
            email: email,
            username: username,
            password: password
        })

        user.save();

        // Envoi d'une réponse indiquant que les informations de l'utilisateur ont été sauvegardées
        res.status(201).json({ message: 'L\'utilisateur a été mis à jour avec succès !' })

    } catch (error) {
        // Gestion des erreurs
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


// Controller pour connecter un utilisateur
const connectUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Le nom d\'utilisateur ou mot de passe est incorrect' });
        }

        // Générer et retourner un token d'authentification si l'authentification est réussie
        const token = generateAuthToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createUser,
    getAllUser,
    getOneUser,
    deleteOneUser,
    updateOneUser,
    connectUser
}