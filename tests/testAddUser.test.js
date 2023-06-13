const User = require('../models/user');
const bcrypt = require('bcrypt');
const { createUser, getAllUser, getOneUser, deleteOneUser, updateOneUser, connectUser } = require('../controllers/userController');

// Mock du modèle User
jest.mock('../models/user');

describe('User Controller', () => {
  // test unitaire de la création de l'utilisateur
  describe('createUser', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          nom: 'John Doe',
          age: 30,
          email: 'johndoe@example.com',
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');  // Mock de la fonction de hachage pour renvoyer une valeur prédéfinie

      await createUser(req, res);

      expect(User).toHaveBeenCalledTimes(1); // Vérifier si le constructeur User a été appelé
      expect(User).toHaveBeenCalledWith({ // Vérifier si le constructeur User a été appelé avec les bonnes valeurs
        nom: 'John Doe',
        age: 30,
        email: 'johndoe@example.com',
        username: 'johndoe',
        password: 'hashedPassword'
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 6); // Vérifier si la fonction de hachage a été appelée avec les bonnes valeurs
      expect(res.status).toHaveBeenCalledWith(201); // Vérifier si la fonction status() a été appelée avec le bon code de statut
      expect(res.json).toHaveBeenCalledWith({ message: 'L\'utilisateur a été créé avec succès !' }); // Vérifier si la fonction json() a été appelée avec le bon message
    });

    it('should handle errors during user creation', async () => {
      const req = {
        body: {
          nom: 'John Doe',
          age: 30,
          email: 'johndoe@example.com',
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      bcrypt.hash = jest.fn().mockRejectedValue(new Error('Hashing failed')); // Mock de la fonction de hachage pour renvoyer une erreur

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500); // Vérifier si la fonction status() a été appelée avec le bon code de statut
      expect(res.json).toHaveBeenCalledWith({ message: 'Hashing failed' }); // Vérifier si la fonction json() a été appelée avec le bon message d'erreur
    });
  });

  // test unitaire de la fonction getAllUser
  describe('getAllUser', () => {
    it('should get all users', async () => {
      const users = [
        { nom: 'John Doe', age: 30, email: 'johndoe@example.com', username: 'johndoe' },
        { nom: 'Jane Smith', age: 25, email: 'janesmith@example.com', username: 'janesmith' }
      ];

      User.find = jest.fn().mockResolvedValue(users);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getAllUser(req, res);

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors during fetching all users', async () => {
      User.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getAllUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
  
  // test unitaire de la fonction getOneUser
  describe('getOneUser', () => {
    it('should get one user', async () => {
      const user = { nom: 'John Doe', age: 30, email: 'johndoe@example.com', username: 'johndoe' };

      User.findById = jest.fn().mockResolvedValue(user);

      const req = {
        params: {
          id: '123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getOneUser(req, res);

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should handle errors during fetching one user', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('User not found'));

      const req = {
        params: {
          id: '123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  // test unitaire de la fonction deleteOneUser
  describe('deleteOneUser', () => {
    it('should delete one user', async () => {
      User.deleteOne = jest.fn().mockResolvedValue();

      const req = {
        params: {
          id: '123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await deleteOneUser(req, res);

      expect(User.deleteOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'L\'utilisateur a été supprimé avec succès !' });
    });

    it('should handle errors during user deletion', async () => {
      User.deleteOne = jest.fn().mockRejectedValue(new Error('Deletion failed'));

      const req = {
        params: {
          id: '123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await deleteOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deletion failed' });
    });
  });

  // test unitaire de la fonction updateOneUser
  describe('updateOneUser', () => {
    it('should update one user', async () => {
      const user = { set: jest.fn(), save: jest.fn() };

      User.findById = jest.fn().mockResolvedValue(user);

      const req = {
        params: {
          id: '123'
        },
        body: {
          nom: 'John Doe',
          age: 30,
          email: 'johndoe@example.com',
          username: 'johndoe',
          password: 'newpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateOneUser(req, res);

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(user.set).toHaveBeenCalledWith({
        nom: 'John Doe',
        age: 30,
        email: 'johndoe@example.com',
        username: 'johndoe',
        password: 'newpassword'
      });
      expect(user.save).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'L\'utilisateur a été mis à jour avec succès !' });
    });

    it('should handle errors during user update', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('User not found'));

      const req = {
        params: {
          id: '123'
        },
        body: {
          nom: 'John Doe',
          age: 30,
          email: 'johndoe@example.com',
          username: 'johndoe',
          password: 'newpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  // test unitaire pour la connexion de l'utilisateur
  describe('connectUser', () => {
    it('should connect a user', async () => {
      const user = { username: 'johndoe', password: 'hashedPassword' };

      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const req = {
        body: {
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const expectedToken = 'token';

      jest.mock('../middleware/auth', () => ({
        generateAuthToken: jest.fn().mockReturnValue(expectedToken)
      }));

      await connectUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'johndoe' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });

    it('should handle incorrect username or password during user connection', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const req = {
        body: {
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await connectUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    });

    it('should handle incorrect password during user connection', async () => {
      const user = { username: 'johndoe', password: 'hashedPassword' };

      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const req = {
        body: {
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await connectUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Le nom d\'utilisateur ou mot de passe est incorrect' });
    });

    it('should handle errors during user connection', async () => {
      User.findOne = jest.fn().mockRejectedValue(new Error('User connection failed'));

      const req = {
        body: {
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await connectUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'User connection failed' });
    });
  });
});