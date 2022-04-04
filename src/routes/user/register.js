import Router from 'express';
import {SUCCESS_ITA, REG} from '../../config/constants.js';
import User from '../../models/user.model.js';

const router = Router();

router.post('/register', function(req, res){
    if (!req.body) return res.status(400).json({error: {message: 'Content cannot be empty'}});
    req.body.cf = req.body.cf.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    if(!req.body.email.match(REG.EMAIL)) return res.status(400).json({error: {message: 'Campo email non valido'}})

    new User (req.body)
    .then(user => user.register())
    .then(result => { return res.status(201).json({result, message: SUCCESS_ITA.REGISTER}) }) 
    .catch(err => { console.log(err); return res.status(500).json({error: {message: err}})})      
});

export default router;