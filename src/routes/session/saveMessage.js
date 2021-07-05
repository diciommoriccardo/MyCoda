import Router from 'express';
import Message from '../../models/message.model.js';
import Session from '../../models/session.model.js';
import { SUCCESS_ITA } from '../../config/constants';

const router = Router();

router.post('/:id/message', (req, res) =>{
    const content = req.body
    const session = { id: req.params.id }
    
    new Session(session)
    .then(session => session.findById())
    .then(result => {
        const { cfUtente, pivaFarma, id } = result
        const message = {
            cfUtente,
            pivaFarma,
            idSession: id,
            content: content
        }

        return new Message(message)
    })
    .then(message => message.create())
    .then(result => res.status(201).json({result, message: SUCCESS_ITA.DEFAULT}))
    .catch(err => res.status(500).json({error: {message: err}}))
})