import jwt from '../../helpers/jwt.js';
import User from '../../models/user.model.js';
import Router from 'express';

const router = Router();

router.post('/login', function(req, res){
    if(!req.body){ res.status(400).json({message: 'Content cannot be empty'})}
    if(!((req.body.cf) && (req.body.password))){ res.status(400).json({message:  'Cf and password are required'})}

        new User( req.body )
        .then( (user) => {
            user.login()
            .then((row) => {
                var userAccessToken = jwt.signAccessToken({user: user.cf})
                res.status(201).json({accessToken: userAccessToken, row});
            })
        })
        .catch( (err) => {res.status(500).json({message: err})})
});

export default router;