import mongoose from "mongoose"
const {Schema} = mongoose;

const gameSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    cover: {
        type: String,
    },
    infos: {
        type: Object,
    },
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);

export default {Game, gameSchema};