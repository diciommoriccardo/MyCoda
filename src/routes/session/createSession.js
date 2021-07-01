import Router from 'express';
import Session from '../../models/session.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:id', (req, res) => {
    new Session({
        pivaFarm: req.params.id,
        cfUtente: req.user.id
    })
    .then(session => session.create())
    .then(result => { return res.status(201).json({result: result, message: SUCCESS_ITA.DEFAULT})})
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router