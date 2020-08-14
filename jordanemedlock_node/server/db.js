const mongo = require('mongodb');

const url = "mongodb://root_username:3WRlofaeYI0VDQV@localhost:27017/"

mongo.MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    console.log('Database created!');
    var dbo = db.db('jordanemedlock')
    // dbo.addUser('jordan', 'IGndA193gawG84M')
    dbo.collection('games').insertOne({
        gameNumber: '1234',
        board: {},
        players: []
    }, (err, res) => {
        if (err) throw err;
        console.log('1 game inserted');
        db.close();
    });
})