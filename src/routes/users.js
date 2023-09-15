const jwt = require('jsonwebtoken');
const router = require('express').Router();
const steam = require('../services/steamApi/steam');
const steamController = require('../controllers/steamController');
const userController = require('../controllers/userController');



// Verify token
const verifyToken = (req, res, next) => {

    const token = req.header('Authorization');
    const secret = process.env.JWT_SECRET;

    if (!token) {
        res.status(401).json({ message: 'Acesso negado!' });
    } else {
        try {
            req.user = jwt.verify(token, secret);
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                res.status(400).json({ message: 'Token JWT inválido' });
            } else {
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        }
    }
}

// Create a new user
router.post('/users', verifyToken, async (req, res) => {
    const { _id, name, username, email, photo } = req.body;
    console.log(req.body)
    try {
        if (!_id || !name || !username || !email) {
            throw new Error('Campos inválidos!');
        }
        const user = await userController.createUser(
            {
                _id,
                name,
                username,
                email,
                photo,
            });
        res.status(201).json({ message: 'Usuário criado com sucesso!' , user: user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a user by id
router.get('/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userController.getUser(id);
        res.status(200).json({ message: 'Usuário encontrado com sucesso!', user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users
router.get('/users',verifyToken, async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        res.status(200).json({ message: 'Usuários encontrados com sucesso!', users: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user by id
router.put('/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, username, email, photo } = req.body;
    try {
        const user = await userController.updateUser({ id, name, username, email, photo });
        res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a user by id
router.delete('/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userController.deleteUser(id);
        res.status(200).json({ message: 'Usuário deletado com sucesso!', user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para adicionar o steamID do usuário
router.post('/users/:id/steam', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { steamId } = req.body;
    try {
        const user = await steamController.addSteamId(id, steamId);
        res.status(200).json({ message: 'SteamID adicionado com sucesso!', user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add steam games to user
router.post('/users/:id/games', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const userSteamId = await steamController.getSteamId(id);

        const userGames = await steam.getGamesOwned(userSteamId);

        const user = await steamController.addSteamGames(id, userGames);
        res.status(200).json({ message: 'Jogos adicionados com sucesso!', user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;