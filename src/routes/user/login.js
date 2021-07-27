import jwt from '../../helpers/jwt.js';
import User from '../../models/user.model.js';
import Router from 'express';

const router = Router();

router.post('/login', function(req, res){
    if(!req.body) return res.status(400).json({error: {message: 'Content cannot be empty'}});
    if(!req.body.cf || !req.body.password) return res.status(400).json({error: {message:  'Cf and password are required'}});

    new User ( req.body )
    .then(user => user.login())
    .then(row => {
        const { cf, nome, cognome, numTel, email, refresh_token } = row;
        var accessToken = jwt.signAccessToken({ id: cf, type: "user" })
        return res.status(200).json({ 
            cf,
            nome,
            cognome,
            numTel,
            email,
            accessToken,
            refresh_token
        });
    })
    .catch(err => { return res.status(500).json({error: {message: err}}) })
});

export default router;