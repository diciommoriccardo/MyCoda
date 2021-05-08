import express from 'express';
import jwt from '../helpers/jwt.js';
import JWT from '../config/constants.js';
import ERRORS from '../config/constants.js';
import controller from '../controller/user.controller.js'

const app = express();

app.post('/users/login', controller.login);

export default app;