import Router from 'express';
import jwt from '../helpers/jwt.js';
import JWT from '../config/constants.js';
import ERRORS from '../config/constants.js';
import controller from '../controller/user.controller.js'
const router = Router();

router.get('/users/:id', controller.findAll);

export default router;