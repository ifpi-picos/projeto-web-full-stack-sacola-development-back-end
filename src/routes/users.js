import { Router } from 'express';
import steam from '../services/steamApi/steam.js';
import userController from '../controllers/userController.js';
import steamController from '../controllers/steamController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { fork } from 'child_process';

const router = Router();



// Create a new user
router.post('/user', verifyToken, async (req, res) => {
    const {_id, name, username, email, photo} = req.body;

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
        console.log({message: 'Usuario criado com sucesso!', user: user})
        res.status(201).json({message: 'Usuário criado com sucesso!', user: {name, username}});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Usuário já cadastrado!') {
            res.status(409).json({message: error.message});
        } else if (error.message === 'Campos inválidos!') {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Get all users
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        res.status(200).json({message: 'Usuários encontrados com sucesso!', users: users});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get a user by id
router.get('/user', verifyToken, async (req, res) => {
    const uid = req.uid;
    try {
        const user = await userController.getUser(uid);
        res.status(200).json({message: 'Usuário encontrado com sucesso!', user: user});
    } catch (error) {
        if (error.message === 'Usuário não encontrado!') {
            res.status(404).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Update a user by id
router.put('/user', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {username, photo} = req.body;
    console.log(photo)
    try {
        const user = await userController.updateUser({uid, username, photo});
        console.log({message: 'Usuario atualizado com sucesso!', user: user})
        res.status(200).json({message: 'Usuário atualizado com sucesso!', user: {username}});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Usuário não encontrado!') {
            res.status(404).json({message: error.message});
        } else if (error.message === 'Id não informado!') {
            res.status(400).json({message: error.message});
        } else if (error.message === 'Dados não informados!') {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Delete a user by id
router.delete('/user', verifyToken, async (req, res) => {
    const uid = req.uid;
    try {
        const user = await userController.deleteUser(uid);
        console.log({message: 'Usuario deletado com sucesso!', user: user})
        res.status(204).json({message: 'Usuário deletado com sucesso!'});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Usuário não encontrado!') {
            res.status(404).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});


// Rota para adicionar jogo ao usuário
router.put('/user/games', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {game} = req.body;
    try {
        const user = await userController.addGameToUser(uid, game);
        console.log({message: 'Jogo adicionado com sucesso!', user: user})
        res.status(200).json({message: 'Jogo adicionado com sucesso!', user: user});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Jogo não informado!') {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

//Rota para pegar os jogos do usuário
router.get('/user/games', verifyToken, async (req, res) => {
    const uid = req.uid;
    try {
        const response = await userController.getLocalUserGames(uid);
        console.log({message: `Jogos locais do usuario ${uid} foram encontrados com sucesso`, games: response})
        res.status(200).json({message: 'Jogos encontrados com sucesso!', games: response});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Rota para atualizar o status do jogo do usuário
router.put('/user/games/status', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {game, status, location} = req.body;
    try {
        const user = await userController.updateGameStatus(uid, game, status, location);
        console.log({message: 'Status do jogo atualizado com sucesso!', user: user})
        res.status(200).json({message: 'Status do jogo atualizado com sucesso!'});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Jogo não informado!') {
            res.status(400).json({message: error.message});
        } else if (error.message === 'Jogo já está na lista!') {
            res.status(400).json({message: error.message});
        } else if (error.message === 'Jogo não encontrado!'){
            res.status(404).json({message: error.message});
        }
    }

});

// Rota para pegar a lista de status dos jogos do usuário
router.get('/user/games/status/:status?', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {status} = req.params;
    console.log(status)
    try {
        const response = await userController.getUserGamesStatus(uid, status);
        console.log({message: `Status dos jogos do usuario ${uid} foram encontrados com sucesso`, gameStatusList: response})
        res.status(200).json({message: 'Status dos jogos encontrados com sucesso!', gameStatusList: response});
    } catch (error) {
        if (error.message === 'Usuário não encontrado!') {
            res.status(404).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Rota para pegar o status especifico de um jogo do usuário
router.get('/user/games/status/game/:gameId?', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {gameId} = req.params;

    try {
        const response = await userController.getUserGameStatusById(uid, gameId);
        console.log({message: `Status do jogo ${gameId} do usuario ${uid} foi encontrado com sucesso`, gameStatus: response})
        res.status(200).json({message: 'Status do jogo encontrado com sucesso!', gameStatus: response});
    } catch (error) {
        if (error.message === 'Usuário não encontrado!') {
            res.status(404).json({message: error.message});
        } else if (error.message === 'Jogo não encontrado!'){
            res.status(404).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Rota para remover o status do jogo do usuário
router.delete('/user/games/status', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {game, status} = req.body;
    try {
        const user = await userController.removeGameFromStatusList(uid, game, status);
        console.log({message: 'Status do jogo removido com sucesso!', user: user})
        res.status(204).json({message: 'Status do jogo removido com sucesso!'});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Jogo não informado!') {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Rota para deletar jogo do usuário
router.delete('/user/games', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {game} = req.body;
    try {
        const user = await userController.deleteLocalGameFromUser(uid, game);
        res.status(204).json({message: 'Jogo deletado com sucesso!'});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message});
    }
});





// Rota para adicionar o steamID do usuário
router.put('/user/steam', verifyToken, async (req, res) => {
    const uid = req.uid;
    const {steamId} = req.body;
    try {
        const user = await steamController.addSteamId(uid, steamId);
        res.status(200).json({message: 'SteamID adicionado com sucesso!'});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'SteamID não informado!') {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Rota para pegar o steamID do usuário
router.get('/user/steam', verifyToken, async (req, res) => {
    const uid = req.uid;
    try {
        const response = await steamController.getSteamId(uid);
        res.status(200).json({message: 'SteamID encontrado com sucesso!', steamId: response});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'SteamID não encontrado!') {
            res.status(404).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Rota para remover o steamID do usuário
router.delete('/user/steam', verifyToken, async (req, res) => {
    const uid = req.uid;
    try {
        const user = await steamController.removeSteamIdFromUser(uid);
        await steamController.removeSteamGamesFromUser(uid);
        console.log({message: 'SteamID removido com sucesso!', user: user})
        res.status(204).json({message: 'SteamID removido com sucesso!'});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'SteamID não encontrado!') {
            res.status(404).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

// Add steam games to user
router.put('/user/steam/games', verifyToken, async (req, res) => {
    const uid = req.uid;

    try {
        const userSteamId = await steamController.getSteamId(uid);
        console.log('chegou aqui', userSteamId);
        const userGames = await steam.getGamesOwned(userSteamId);
        console.log('chegou aqui');
        const user = await steamController.addSteamGamesToUser(uid, userGames);
        console.log('chegou aqui');
        await steamController.addSteamGamesToDatabase(userGames);

        // const child = fork('./src/utils/steamGameToDb.js');
        // child.send(userGames);
        // child.on('exit', () => {
        //     console.log('Child process finished');
        // });

        console.log({message: 'Jogos adicionados com sucesso!', user: user})
        res.status(200).json({message: 'Jogos adicionados com sucesso!'});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message});
    }
});

// Get steam games from user
router.get('/user/steam/games', verifyToken, async (req, res) => {
    const uid = req.uid;
    try {
        const response = await steamController.getSteamGamesFromUser(uid);
        res.status(200).json({message: 'Jogos encontrados com sucesso!', games: response});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message});
    }
});


export default router;