import User from '../models/user.model.js';
import jwt from '../helpers/jwt.js';
import {ERRORS} from '../config/constants.js';
import authMiddleware from '../middlewares/auth.js';

const controller = {
    findAll: (req, res) => {
        
    },
    login: function(req, res, next) {
        
    },
    findByCf: (req, res) => {
        
    },
    register: (authMiddleware, req, res) => {
        
    }
}

export default controller
