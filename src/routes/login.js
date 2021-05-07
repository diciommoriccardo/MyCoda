import Router from 'express';
import jwt from '../helpers/jwt.js';
import JWT from '../config/constants.js';
import ERRORS from '../config/constants.js';
import controller from '../controller/user.controller.js'
const router = Router();

router.post('/users/login', controller.login);

export default router;