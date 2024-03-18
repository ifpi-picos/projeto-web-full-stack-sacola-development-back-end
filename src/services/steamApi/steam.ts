const SteamAPIKey = process.env.STEAM_API;

const steam = {
    async getGamesOwned(steamId) {
        const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${SteamAPIKey}&steamid=${steamId}&format=json`;
        const response = await fetch(url);
        return await response.json();
    },

    async getSteamGameById(SteamGameId) {
        //Has to get all the infos from the game, including the id to get the game's cover
        const url = `https://store.steampowered.com/api/appdetails?appids=${SteamGameId}`;
        const response = await fetch(url);
        return await response.json();
    },

    async getSteamGameByName(SteamGameName) {
        //Has to get all the infos from the game, including the id to get the game's cover
        const url = `https://store.steampowered.com/api/storesearch/?term=${SteamGameName}&l=english&cc=br`;
        const response = await fetch(url);
        return await response.json();
    },
}

module.exports = steam;