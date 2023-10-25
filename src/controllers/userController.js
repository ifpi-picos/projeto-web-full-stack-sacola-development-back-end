const UserModel = require('../models/user');
const {verifyIfUserExists} = require('./verifications');


// Funções do controller
const userController = {
    // Função para criar um novo usuário
    async createUser(userDTO) {
        try {
            const user = await UserModel.findById(userDTO._id);
            if (!user) {
                return await UserModel.create(userDTO);
            } else {
                throw new Error('Usuário já cadastrado!');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para buscar um usuário pelo id
    async getUser(id) {
        try {
            if (!id) throw new Error('Id não informado!');
            const user = await UserModel.findById(id);

            if (!user) {
                throw new Error('Usuário não encontrado!');
            }

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para buscar todos os usuários
    async getAllUsers(userDTO) {
        try {
            const users = await UserModel.find();
            if (users) {
                return users;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para atualizar um usuário
    async updateUser(userDTO) {

        if (!userDTO.name && !userDTO.username) throw new Error('Dados não informados!');

        const {uid, name, username, email, photo} = userDTO;

        try {
            if (!await verifyIfUserExists(uid)) {
                throw new Error('Usuário não encontrado!');
            }
            const user = await UserModel.findById(uid);
            if (user) {
                user.name = name;
                user.username = username;
                user.email = email;
                user.photo = photo;
                await user.save();
                return user;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para deletar um usuário
    async deleteUser(id) {
        try {
            if (!await verifyIfUserExists(id)) {
                throw new Error('Usuário não encontrado!');
            }

            const user = await UserModel.findById(id);
            if (user) {
                await UserModel.findByIdAndDelete(id);
                return user;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para adicionar um jogo ao usuário
    async addGameToUser(id, game) {
        try {

            if (game === undefined) {
                throw new Error('Jogo não informado!');
            }

            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }

            const user = await UserModel.findById(id);
            if (user) {

                //verifica se o jogo já está na lista e se estiver não adiciona
                if (user.userGames.games.length > 0) {
                    const gameList = user.userGames.games[0].LocalGameData.game_List;
                    const gameExists = gameList.includes(game);
                    if (gameExists) {
                        console.log(gameExists, game);
                        throw new Error('Jogo já adicionado!');
                    }
                    console.log(gameExists, game);
                }


                user.userGames.games_total += 1;

                if (user.userGames.games.length === 0) {
                    user.userGames.games = {LocalGameData: {game_count: 1, game_List: [game]}};
                    await user.save();
                    return user;
                }

                const LocalGameData = {
                    game_count: user.userGames.games[0].LocalGameData.game_count + 1,
                    game_List: [...user.userGames.games[0].LocalGameData.game_List, game]
                }

                user.userGames.games = {LocalGameData};

                await user.save();
                return user;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getLocalUserGames(id) {
        try {
            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }

            const user = await UserModel.findById(id);
            if (user) {
                return user.userGames.games[0].LocalGameData;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async deleteLocalGameFromUser(id, game) {
        try {

            if (game === undefined) {
                throw new Error('Jogo não informado!');
            }

            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }

            const user = await UserModel.findById(id);
            if (user) {
                if (user.userGames.games.length === 0) {
                    throw new Error('Usuário não possui jogos!');
                }

                if (user.userGames.games[0].LocalGameData.game_List.length === 0) {
                    throw new Error('Usuário não possui jogos!');
                } else if (!user.userGames.games[0].LocalGameData.game_List.includes(game)) {
                    throw new Error('Jogo não encontrado!');
                }


                const LocalGameData = {
                    game_count: user.userGames.games[0].LocalGameData.game_count - 1,
                    game_List: user.userGames.games[0].LocalGameData.game_List.filter((gameItem) => gameItem !== game)
                }


                user.userGames.games_total -= 1;
                user.userGames.games = {LocalGameData};

                await user.save();
                return user;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = userController;