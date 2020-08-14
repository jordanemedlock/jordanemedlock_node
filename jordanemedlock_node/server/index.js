import express from 'express';
import mongo from 'mongodb';
import httpModule from 'http';
import ioModule from 'socket.io';
import { Game } from './common/models.js';


const app = express()
const port = 3001
const http = httpModule.createServer(app);
const io = ioModule(http);

const connectionString = "mongodb://root_username:3WRlofaeYI0VDQV@jordanemedlock_mongo:27017/"

mongo.MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    console.log('Database opened!');
    var db = client.db('jordanemedlock')


    app.get('/', (req, res) => res.send('Hello World!'))

    app.get('/api/game/create/:playerName', (request, response) => {
        const gameNumber = makeGameNumber();

        const game = Game.startGame(gameNumber, request.params.playerName);

        db.collection('game').insertOne(game, (err, result) => {
            if (err) throw err;
            response.send(game);
        })
    })


    app.get('/api/game/join/:gameNumber/:playerName', (req, res) => {
        // TODO: setup db
        res.send({game: "some game", player: req.params.playerName})
    })

    io.on('connection', (socket) => {
        console.log('a user connected')
        socket.on('disconnect', () => {
            console.log('a user disconnected')
        })

        socket.on('game-channel', (msg) => {
            console.log(msg)
        })
    })
    
    http.listen(port, () => {
        console.log(`listening at http://localhost:${port}`)
    })
})

const makeGameNumber = () => {
    const number = Math.floor(Math.random() * 100000);
    const str = (number + '').substr(1, 4);
    return str;
}