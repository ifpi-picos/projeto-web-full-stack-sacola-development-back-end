const UserModel = require("../models/user");
const GameModel = require("../models/game");
const {verifyIfUserExists} = require('../utils/verifications');
const {getSteamGameById} = require("../services/steamApi/steam");

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

    async addSteamGamesToDatabase(games) {
        try {
            const steamGames = games.response.games;
            console.log(steamGames.length);
            for (let i = 0; i < steamGames.length; i++) {
                if (await GameModel.Game.findById(steamGames[i].appid)) {
                    continue;
                }
                const gameDetails = await getSteamGameById(steamGames[i].appid);
                const game = new GameModel.Game({
                    _id: steamGames[i].appid,
                    infos: gameDetails[steamGames[i].appid].data
                });

                await game.save();
            }
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    },

    async getSteamGameInfo(steamGameId) {
        try {
            return await getSteamGameById(steamGameId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = steamController;