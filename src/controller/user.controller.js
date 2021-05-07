import User from '../models/user.model.js';
import jwt from '../helpers/jwt.js';
import ERRORS from '../config/constants.js';

const controller = {
    findAll: (req, res) => {
        
    },
    login: (req, res) => {
        if(!req.body){ res.status(400).send({ message: 'Content cannot be empty'})}
        if(!req.body.cf || !req.body.password){ res.status(400).send({ message: 'Cf and password are required'})}

        var user = new User({
            cf: req.body.cf,
            password: req.body.password
        })

        user.login()
        .then( (result) => {
            var userAccessToken = jwt.signAccessToken(result.cf)
            res.status(201).send(userAccessToken);
        })
        .catch( (err) => {res.status(500).send({ message: ERRORS.LOGIN})})
    },
    findByCf: (req, res) => {
        if(!req.body){res.status(400).send({ message: 'Content cannot be empty'})}
        if(!req.body.cf){ res.status(400).send({ message: 'Cf are required'})}

        var user = new User({
            cf: req.body.cf
        })

        user.findByCf(cf)
        .then( (result) =>{
            res.status(201).send(result)
        })
        .catch( (err) => {res.status(500).send({ message: err})})
    }
}

export default controller
