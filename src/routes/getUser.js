import Router from 'express';
import jwt from '../helpers/jwt.js';
import controller from '../controller/user.controller.js';
import JWT from '../config/constants.js';
import ERRORS from '../config/constants.js';
//import router from './token.js';

const router = Router();

router.get('/users/:id', user.findAll)

export default router;