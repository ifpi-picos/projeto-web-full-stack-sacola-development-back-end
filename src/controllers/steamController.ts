const UserModel = require("../models/user");
const GameModel = require("../models/game");
const {verifyIfUserExists} = require('../utils/verifications');
const {getSteamGameById} = require("../services/steamApi/steam");
const {getSteamGridDbGameCover} = require("../services/steamGridDb/steamgriddb.js");

const steamController = {
    //Função para adicionar o steamId do usuário
    async addSteamId(id, steamId) {
        try {
            await verifyIfUserExists(id);
            const user = await UserModel.findById(id);
            if (user) {
                user.storeKeys.steam = steamId;
                await user.save();
                return user;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    //Função para pegar o steamId do usuário
    async getSteamId(id) {
        try {
            await verifyIfUserExists(id);
            const user = await UserModel.findById(id);
            if (user) {
                return user.storeKeys.steam;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async removeSteamIdFromUser(id) {
        try {
            await verifyIfUserExists(id);
            const user = await UserModel.findById(id);
            if (user) {
                user.storeKeys.steam = null;
                await user.save();
                return user;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    //Função para adicionar os jogos steam do usuário
    async addSteamGamesToUser(id, games) {
        try {
            await verifyIfUserExists(id);
            const user = await UserModel.findById(id);
            if (user) {
                user.userGames.games.steam.game_List = games.response.games.map(game => game.appid);
                user.userGames.games.steam.game_count = games.response.game_count;

                user.userGames.games_total = user.userGames.games.LocalGameData.game_count + user.userGames.games.steam.game_count;
                await user.save();
                return user;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Função para pegar os jogos steam do usuário
    async getSteamGamesFromUser(id) {
        try {
            await verifyIfUserExists(id);
            const user = await UserModel.findById(id);
            if (user) {
                const userGamesList = user.userGames.games.steam.game_List;
                const steamGames = [];
                for (let i = 0; i < userGamesList.length; i++) {
                    const game = await GameModel.Game.findById(userGamesList[i]);
                    if (game !== null) {
                        steamGames.push(game);
                    }
                }
                return steamGames;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    //Função para apagar os jogos steam do usuário
    async removeSteamGamesFromUser(id) {
        try {
            await verifyIfUserExists(id);
            const user = await UserModel.findById(id);
            if (user) {
                user.userGames.games.steam.game_List = [];
                user.userGames.games.steam.game_count = 0;

                user.userGames.games_total = user.userGames.games.LocalGameData.game_count + user.userGames.games.steam.game_count;
                await user.save();
                return user;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    //Função para adicionar os jogo steam no banco de dados
    async addSteamGamesToDatabase(games) {
        try {
            const steamGames = games.response.games;
            console.log(steamGames.length);
            for (let i = 0; i < steamGames.length; i++) {
                if (await GameModel.Game.findById(steamGames[i].appid)) {
                    continue;
                }
                const gameDetails = await getSteamGameById(steamGames[i].appid);
                let cover = await getSteamGridDbGameCover(steamGames[i].appid);
                if (!cover) {
                    cover = `https://steamcdn-a.akamaihd.net/steam/apps/${steamGames[i].appid}/library_600x900.jpg`
                }
                const game = new GameModel.Game({
                    _id: steamGames[i].appid,
                    cover: cover,
                    infos: gameDetails[steamGames[i].appid].data
                });

                await game.save();
            }
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    },

    // Função para pegar o jogo steam do banco de dados
    async getSteamGameFromDatabase(steamAppId) {
        try {
            return await GameModel.Game.findById(steamAppId);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    //Função para pegar os jogos steam do usuário
    async getSteamGameInfo(steamGameId) {
        try {
            return await getSteamGameById(steamGameId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = steamController;