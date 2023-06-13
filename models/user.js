// const mongoose = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true,
        default: 0,
        // validate(value) {
        //     if (value < 0) throw new Error('Age doit être positif !');
        // }
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        // validate(value) {
        //     if (!validator.isEmail(value)) throw new Error('Email est invalide !');
        // }
    },

    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minlenght: 6,
        // validate(value) {
        //     if (!validator.isLength(value, { min: 6, max: 12 })) throw new Error('Le mot de passe doit être entre 6 et 12 caractères !');
        // }
    }
});


// exporter le model user avec userSchema
module.exports = mongoose.model('User', userSchema);
