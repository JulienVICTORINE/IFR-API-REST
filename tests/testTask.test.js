const { createTask, getAllTasks, getOneTask, deleteTask, updateOneTask } = require('../controllers/taskControllers');
const Task = require('../models/task');

// Mock du modèle de tâche
jest.mock('../models/task');


// test unitaire pour la création d'une tâche
describe('createTask', () => {
    it('should create a new task', async () => {
        const req = {
            body: {
                name: 'Task Name',
                description: 'Task Description',
                date: '2023-06-13',
                completed: false
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(), // créer une fonction simulée pour Task afin de vérifier les appels ultérieurs et simuler la fonction save du modèle de tâche
            json: jest.fn()
        };
        const saveMock = jest.fn();
        Task.mockImplementation(() => {
            return {
                save: saveMock
            };
        });

        await createTask(req, res);

        expect(Task).toHaveBeenCalledWith({
            name: 'Task Name',
            description: 'Task Description',
            date: '2023-06-13',
            completed: false
        });
        expect(saveMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'La tâche a bien été créée !' });
    });


    // vérifie si la fonction createTask gère les erreurs correctement en cas d'échec de la création de la tâche.
    it('should handle errors when creating a task', async () => {
        const req = {
            body: {
                name: 'Task Name',
                description: 'Task Description',
                date: '2023-06-13',
                completed: false
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const errorMessage = 'Error message';
        Task.mockImplementation(() => {
            return {
                save: jest.fn().mockRejectedValue(new Error(errorMessage))
            };
        });

        await createTask(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});


// test unitaire pour afficher toutes les tâches
describe('getAllTasks', () => {
    it('should get all tasks', async () => {
        const tasks = [
            { name: 'Task 1', description: 'Description 1', date: '2023-06-13', completed: false },
            { name: 'Task 2', description: 'Description 2', date: '2023-06-14', completed: true }
        ];
        const findMock = jest.fn().mockResolvedValue(tasks);
        Task.find = findMock;
        const res = {
            status: jest.fn().mockReturnThis(), // simuler la fonction find du modèle de tâche et renvoyer une promesse résolue avec des tâches simulées
            json: jest.fn()
        };

        await getAllTasks({}, res);

        expect(findMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(tasks);
    });

    // vérifie si la fonction getAllTasks gère les erreurs correctement en cas d'échec de la récupération des tâches
    it('should handle errors when getting all tasks', async () => {
        const errorMessage = 'Error message';
        Task.find = jest.fn().mockRejectedValue(new Error(errorMessage)); // la fonction find du modèle de tâche est simulée pour renvoyer une promesse rejetée avec une erreur simulée
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getAllTasks({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});


// test unitaire pour afficher une tâche
describe('getOneTask', () => {
    it('should get one task by ID', async () => {
        const task = { name: 'Task 1', description: 'Description 1', date: '2023-06-13', completed: false };
        const findByIdMock = jest.fn().mockResolvedValue(task);
        Task.findById = findByIdMock;
        const req = {
            params: {
                id: 'task-id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(), // simuler la fonction findById du modèle de tâche et renvoyer une promesse résolue avec une tâche simulée
            json: jest.fn()
        };

        await getOneTask(req, res);

        expect(findByIdMock).toHaveBeenCalledWith('task-id');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(task);
    });

    // vérifie si la fonction getOneTask gère les erreurs correctement en cas d'échec de la récupération de la tâche
    it('should handle errors when getting one task', async () => {
        const errorMessage = 'Error message';
        Task.findById = jest.fn().mockRejectedValue(new Error(errorMessage)); // la fonction findById du modèle de tâche est simulée pour renvoyer une promesse rejetée avec une erreur simulée
        const req = {
            params: {
                id: 'task-id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getOneTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});

// test unitaire pour supprimer une tâche
describe('deleteTask', () => {
    it('should delete a task by ID', async () => {
        const deleteOneMock = jest.fn().mockResolvedValue();
        Task.deleteOne = deleteOneMock;
        const req = {
            params: {
                id: 'task-id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deleteTask(req, res);

        expect(deleteOneMock).toHaveBeenCalledWith({ _id: 'task-id' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cette tâche a été supprimée avec succès !' });
    });

    // vérifie si la fonction deleteTask gère les erreurs correctement en cas d'échec de la suppression de la tâche
    it('should handle errors when deleting a task', async () => {
        const errorMessage = 'Error message';
        Task.deleteOne = jest.fn().mockRejectedValue(new Error(errorMessage));
        const req = {
            params: {
                id: 'task-id'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deleteTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});


// test unitaire pour mettre à jour une tâche
describe('updateOneTask', () => {
    it('should update a task by ID', async () => {
        const task = {
            _id: 'task-id',
            name: 'Task 1',
            description: 'Description 1',
            date: '2023-06-13',
            completed: false,
            save: jest.fn()
        };
        const findByIdMock = jest.fn().mockResolvedValue(task);
        Task.findById = findByIdMock;
        const req = {
            params: {
                id: 'task-id'
            },
            body: {
                name: 'Updated Task Name',
                description: 'Updated Task Description',
                date: '2023-06-14',
                completed: true
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const saveMock = jest.fn();
        task.save = saveMock;

        await updateOneTask(req, res);

        expect(findByIdMock).toHaveBeenCalledWith('task-id');
        expect(task.set).toHaveBeenCalledWith({
            name: 'Updated Task Name',
            description: 'Updated Task Description',
            date: '2023-06-14',
            completed: true
        });
        expect(saveMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: 'La tâche a été mise à jour avec succès !' });
    });

    // vérifie si la fonction updateOneTask gère les erreurs correctement en cas d'échec de la mise à jour de la tâche
    it('should handle errors when updating a task', async () => {
        const errorMessage = 'Error message';
        Task.findById = jest.fn().mockRejectedValue(new Error(errorMessage));
        const req = {
            params: {
                id: 'task-id'
            },
            body: {
                name: 'Updated Task Name',
                description: 'Updated Task Description',
                date: '2023-06-14',
                completed: true
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await updateOneTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});