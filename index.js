const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
// const { protectRoute } = require('./middleware/auth.js');

// les routes
const RouterUser = require('./routers/user.js');
const RouterTask = require('./routers/task.js');

// les models
const Users = require('./models/user');
const Tasks = require('./models/task');

// instanciation du serveur
const app = express()
const port = 3000;

// connexion base de données
mongoose.connect('mongodb+srv://julienvictorine440:ik45qGQ1JY8uppXc@cluster0.g1nsg8d.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// le middleware suivant avant la route d'API - CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// pour la route API
app.use('/api/tasks/', RouterTask);
app.use('/api/users/', RouterUser);


app.listen(port, function () {
  console.log('Server is Running ...............................................................')
});


// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

module.exports = app;