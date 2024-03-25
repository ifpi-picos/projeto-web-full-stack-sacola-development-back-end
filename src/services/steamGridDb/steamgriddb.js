import dotenv from "dotenv";
dotenv.config();

import SGDB from "steamgriddb";
const client = new SGDB({
    key: process.env.STEAMGRIDDB_API_KEY,
    headers: {
        'X-Some-Header': 'Some Value',
    },
    baseURL: 'https://www.steamgriddb.com/api/v2'
});

export async function getSteamGridDbGameCover(gameSteamAppId) {
    try {
        const grids = await client.getGridsBySteamAppId(gameSteamAppId);
        return grids[0].url
    } catch (error) {
        console.log(error);
    }
}