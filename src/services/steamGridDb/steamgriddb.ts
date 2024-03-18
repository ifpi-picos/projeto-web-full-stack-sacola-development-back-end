async function getSteamGridDbGameCover(gameSteamAppId) {
    try {
        const response = await fetch(`https://www.steamgriddb.com/api/v2/games/steam/${gameSteamAppId}` , {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.STEAMGRIDDB_API_KEY}`
            }
        });

        const res1 = await response.json();

        const response2 = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${res1.data.id}?dimensions=600x900` , {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.STEAMGRIDDB_API_KEY}`
            }

        });

        const res2 = await response2.json();
        return res2.data[0].thumb;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getSteamGridDbGameCover
}