import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:id/message', (req, res) => {
    new Session({
        pivaFarm: req.params.id,
        cfUtente: req.user.cf
    })
    .then(session => session.findById())
    .then(([result]) => {
        console.log(result)
        
        new Message({
            cfUtente: result.cfUtente,
            pivaFarm: result.pivaFarm,
            content: req.body.content
        })
    })
    .then(message => message.create())
    .then(resultMessage => { return res.status(201).json({result: resultMessage, message: SUCCESS_ITA.DEFAULT}) })
    .catch(err => { return res.status(500).json({error: {message: err}})})
})

export default router