import express from 'express';
const app = express();

import mongoose from 'mongoose';
import { SERVER , DATABASE } from './src/config/config';

mongoose.connect(DATABASE.URI, DATABASE.OPTIONS).catch( err => null);
const db = mongoose.connection;
db.once('connected', () => { console.log('Connected to MongoDB.'); });
db.on('disconnected', () => { console.log('Disconnected from MongoDB.'); });
db.on('reconnected', () => { console.log('Reconnected to MongoDB.'); });
db.on('error', (err) => {
    console.error(`Error in MongoDb connection: ${err.message}`);
    mongoose.disconnect();
});

app.use(express.json())
const spotifyRoute = require('./src/routes/spotify');
const usersRoute = require('./src/routes/users');
const groupsRoute = require('./src/routes/groups') ;

app.use('/api/spotify', spotifyRoute);
//app.use('/api/users', usersRoute);
//app.use('/api/groups', groupsRoute);

app.listen(SERVER.PORT, SERVER.HOST, () => {
    console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`);
})
