const steamController = require("../controllers/steamController");
const connectDB = require("../db/conn");

console.log("Child process started", process.pid);

process.on("message", async (userGames) => {
    await connectDB();
    console.log("Child process received", process.pid);
    const result = await steamGameToDb(userGames);
    process.send(result);
});

async function steamGameToDb(userGames) {
    try {
        await steamController.addSteamGamesToDatabase(userGames);
        console.log("Child process finished", process.pid);
    } catch (error) {
        console.log(error);
    } finally {
        process.exit();
    }
}