const router = require('express').Router();
const steamController = require('../controllers/steamController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/steam/game/:id', verifyToken, async (req, res) => {
    const {id} = req.params;
    try {
        const gameInfo = await steamController.getSteamGameFromDatabase(id);
        if (gameInfo) {
            res.status(200).json({message: 'Game encontrado com sucesso!', Game: gameInfo});
        } else {
            res.status(404).json({message: 'SteamId não encontrado!'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;