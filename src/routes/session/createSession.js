import Router from 'express';
import Session from '../../models/session.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('/session/:id', (req, res) => {
    if(!req.body.piva) { return res.status(400).json({error: {message: "P. IVA required"}}) }

    new Session({
        pivaFarm: req.params.id,
        cfUtente: req.user.cf
    })
    .then(session => session.create())
    .then(result => { return res.status(201).json({result: result, message: SUCCESS_ITA.DEFAULT})})
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router