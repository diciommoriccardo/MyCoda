import express from 'express';
const app = express();
import MongoDb from './src/helpers/MongoDb';
import Router from './src/helpers/Router';
import { SERVER } from './src/config/config';

app.use(express.json());
new MongoDb();
new Router(app).setAllRoutes();

app.listen(SERVER.PORT, SERVER.HOST, () => {
    console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`);
})
