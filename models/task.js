const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    completed: {
        type: Boolean,
        default: false,
    }


    // champ réel pour la relation entre tache et utilisateur
    // assignedTo: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
});

// exporter le model task avec taskSchema
module.exports = mongoose.model('Task', taskSchema);