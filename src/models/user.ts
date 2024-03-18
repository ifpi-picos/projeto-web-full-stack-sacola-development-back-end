const mongoose = require('mongoose');
const {Schema} = mongoose;


const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    photo: {
        type: String,
        require: false,
    },
    userFriends: {
        friends_total: {
            type: Number,
            default: 0,
        },
        friends: [{
            type: String,
            ref: 'User',
        }]
    },
    userGames: {
        games_total: {
            type: Number,
            default: 0,
        },
        games: {
            LocalGameData: {
                game_count: {
                    type: Number,
                    default: 0,
                },
                game_List: [{
                    type: String,
                }]
            },
            steam: {
                game_count: {
                    type: Number,
                    default: 0,
                },
                game_List: [{
                    type: String,
                }]
            }
        }
    },
    storeKeys: {
        steam: {
            type: String,
        }
    },
    gameStatus: {
        localGames: {
            completeGames: [],
            playingGames: [],
            abandonedGames: [],
            playingLaterGames: [],
        },
        steamGames: {
            completeGames: [],
            playingGames: [],
            abandonedGames: [],
            playingLaterGames: [],
        }
    },
    level: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;