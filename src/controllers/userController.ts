const UserModel = require('../models/user');
const {verifyIfUserExists} = require('../utils/verifications');

// Funções auxiliares
function removeGameFromOtherStatusList(user, game, status, location) {
    const userCopy = user;
    const gameStatus = userCopy.gameStatus[`${location}Games`];
    const statusList = ['completeGames', 'playingGames', 'abandonedGames', 'playingLaterGames'];

    statusList.forEach((statusItem) => {
        if (statusItem !== `${status}Games`) {
            gameStatus[statusItem] = gameStatus[statusItem].filter((gameItem) => gameItem !== game);
        }
    });

    return userCopy;
}

// Funções do controller
const userController = {
    // Função para criar um novo usuário
    async createUser(userDTO) {
        try {
            let user = await UserModel.findById(userDTO._id);
            if (!user) {
                user = await UserModel.create(userDTO);
                return user;
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

        if (!userDTO.username && !userDTO.photo) throw new Error('Dados não informados!');

        const {uid, username, photo} = userDTO;

        try {
            if (!await verifyIfUserExists(uid)) {
                throw new Error('Usuário não encontrado!');
            }
            const user = await UserModel.findById(uid);
            if (user) {
                if (username) user.username = username;
                if (photo) user.photo = photo;
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
                user.userGames.games.LocalGameData.game_List.push(game);
                user.userGames.games.LocalGameData.game_count += 1;

                user.userGames.games_total = user.userGames.games.LocalGameData.game_count + user.userGames.games.steam.game_count;
                await user.save();
                return user;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para buscar os jogos de um usuário
    async getLocalUserGames(id) {
        try {
            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }

            const user = await UserModel.findById(id);
            if (user) {
                return user.userGames.games.LocalGameData;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para atualizar o status de um jogo de um usuário
    async updateGameStatus(id, game, status, location) {
        try {
            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }

            let user = await UserModel.findById(id);
            if (user) {
                if (location === 'steam') {
                    const gameExistsInSteam = user.userGames.games.steam.game_List;
                    if (gameExistsInSteam.includes(game)) {
                        switch (status) {
                            case 'complete':
                                if (user.gameStatus.steamGames.completeGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.steamGames.completeGames.push(game);
                                break;
                            case 'playingNow':
                                if (user.gameStatus.steamGames.playingGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.steamGames.playingGames.push(game);
                                break;

                            case 'abandoned':
                                if (user.gameStatus.steamGames.abandonedGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.steamGames.abandonedGames.push(game);
                                break;

                            case 'playingLater':
                                if (user.gameStatus.steamGames.playingLaterGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.steamGames.playingLaterGames.push(game);
                                break;

                            default:
                                throw new Error('Status não informado!');
                        }
                        await user.save();
                        return user;
                    } else {
                        throw new Error('Jogo não encontrado!');
                    }
                } else if (location === 'local') {
                    const gameExistsInLocal = user.userGames.games.LocalGameData.game_List;
                    console.log(gameExistsInLocal)
                    if (gameExistsInLocal.includes(game)) {
                        switch (status) {
                            case 'complete':
                                if (user.gameStatus.localGames.completeGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.localGames.completeGames.push(game);
                                break;
                            case 'playingNow':
                                if (user.gameStatus.localGames.playingGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.localGames.playingGames.push(game);
                                break;

                            case 'abandoned':
                                if (user.gameStatus.localGames.abandonedGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.localGames.abandonedGames.push(game);
                                break;

                            case 'playingLater':
                                if (user.gameStatus.localGames.playingLaterGames.includes(game)) {
                                    throw new Error('Jogo já está na lista!');
                                }
                                user = removeGameFromOtherStatusList(user, game, status, location);
                                user.gameStatus.localGames.playingLaterGames.push(game);
                                break;

                            default:
                                throw new Error('Status não informado!');
                        }
                        await user.save();
                        return user;
                    } else {
                        throw new Error('Jogo não encontrado!');
                    }
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para buscar o status de um jogo de um usuário
    async getUserGamesStatus(id, status) {
        try {
            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }

            const user = await UserModel.findById(id);
            if (user) {
                switch (status) {
                    case 'completeGames':
                        return {
                            localGames: user.gameStatus.localGames.completeGames,
                            steamGames: user.gameStatus.steamGames.completeGames,
                        };
                    case 'playingGames':
                        return {
                            localGames: user.gameStatus.localGames.playingGames,
                            steamGames: user.gameStatus.steamGames.playingGames,
                        };
                    case 'abandonedGames':
                        return {
                            localGames: user.gameStatus.localGames.abandonedGames,
                            steamGames: user.gameStatus.steamGames.abandonedGames,
                        };
                    case 'playingLaterGames':
                        return {
                            localGames: user.gameStatus.localGames.playingLaterGames,
                            steamGames: user.gameStatus.steamGames.playingLaterGames,
                        }
                    case undefined:
                        return user.gameStatus;
                    default:
                        throw new Error('Status não informado!');
                }
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para buscar o status de um jogo de um usuário pelo id do jogo
    async getUserGameStatusById(id, game) {
        try {
            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }
            const user = await UserModel.findById(id);
            if (user) {
                if (user.gameStatus.completeGames.includes(game)) {
                    return 'complete';
                } else if (user.gameStatus.playingGames.includes(game)) {
                    return 'playingNow';
                } else if (user.gameStatus.abandonedGames.includes(game)) {
                    return 'abandoned';
                } else if (user.gameStatus.playingLaterGames.includes(game)) {
                    return 'playingLater';
                } else {
                    throw new Error('Jogo não encontrado!');
                }
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para remover um jogo da lista de status de um usuário
    async removeGameFromStatusList(id, game, status) {
        try {
            if (await verifyIfUserExists(id) === false) {
                throw new Error('Usuário não encontrado!');
            }

            const user = await UserModel.findById(id);
            if (user) {
                switch (status) {
                    case 'complete':
                        if (!user.gameStatus.completeGames.includes(game)) {
                            throw new Error('Jogo não está na lista!');
                        }
                        user.gameStatus.completeGames = user.gameStatus.completeGames.filter((gameItem) => gameItem !== game);
                        break;
                    case 'playingNow':
                        if (!user.gameStatus.playingGames.includes(game)) {
                            throw new Error('Jogo não está na lista!');
                        }
                        user.gameStatus.playingGames = user.gameStatus.playingGames.filter((gameItem) => gameItem !== game);
                        break;

                    case 'abandoned':
                        if (!user.gameStatus.abandonedGames.includes(game)) {
                            throw new Error('Jogo não está na lista!');
                        }
                        user.gameStatus.abandonedGames = user.gameStatus.abandonedGames.filter((gameItem) => gameItem !== game);
                        break;

                    case 'playingLater':
                        if (!user.gameStatus.playingLaterGames.includes(game)) {
                            throw new Error('Jogo não está na lista!');
                        }
                        user.gameStatus.playingLaterGames = user.gameStatus.playingLaterGames.filter((gameItem) => gameItem !== game);
                        break;

                    default:
                        throw new Error('Status não informado!');
                }
                await user.save();
                return user;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para deletar um jogo de um usuário
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
                if (user.userGames.games.LocalGameData.length === 0) {
                    throw new Error('Usuário não possui jogos!');
                }

                if (user.userGames.games.LocalGameData.game_List.length === 0) {
                    throw new Error('Usuário não possui jogos!');
                } else if (!user.userGames.games.LocalGameData.game_List.includes(game)) {
                    throw new Error('Jogo não encontrado!');
                }


                user.userGames.games.LocalGameData.game_List = user.userGames.games.LocalGameData.game_List.filter((gameItem) => gameItem !== game);
                user.userGames.games.LocalGameData.game_count -= 1;
                user.userGames.games_total -= 1;
                user.gameStatus.localGames.completeGames = user.gameStatus.localGames.completeGames.filter((gameItem) => gameItem !== game);
                user.gameStatus.localGames.playingGames = user.gameStatus.localGames.playingGames.filter((gameItem) => gameItem !== game);
                user.gameStatus.localGames.abandonedGames = user.gameStatus.localGames.abandonedGames.filter((gameItem) => gameItem !== game);
                user.gameStatus.localGames.playingLaterGames = user.gameStatus.localGames.playingLaterGames.filter((gameItem) => gameItem !== game);

                await user.save();
                return user;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = userController;