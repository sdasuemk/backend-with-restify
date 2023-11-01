const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');

// server

const server = restify.createServer();

//Middleware
server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI);
});

const db = mongoose.connection;
db.on('error', (err) => console.error(err));

db.once('open', () =>{
    require('./routes/customers')(server);
    console.log('Mongodb is connected');
    console.log('Server listening on port '+config.PORT);
});
