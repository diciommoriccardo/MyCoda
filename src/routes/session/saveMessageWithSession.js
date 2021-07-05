import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:idSessione/:id/message', (req, res) => {
    if (!req.body.content || req.body.content == '') return res.status(400).json({ error: { message: 'Content cannot be empty' } });
    
    const {senderId, type} = req.user;
    const id = req.params.id;
    const content = req.body.content;
    const sessionId = req.params.idSessione;
    
    const session = {
        ...(type === 'user' ? {id: sessionId, cfUtente: senderId, pivaFarma: id} : {id: sessionId, pivaFarma: senderId, cfUtente: id})
    };

    new Session( session )
        .then(session => session.findOpenSessionById())
        .then(result => result.length === 0 ? new Session(session).create() : result)
        .then(result => new Message({
            cfUtente: result[0].cfUtente,
            pivaFarma: result[0].pivaFarma,
            content: content
        }))
        .then((message) => { console.log(message); return message.create() })
        .then((result) => res.status(201).json(result))
        .catch(err => { return res.status(500).json({error: {message: err}})})
})

export default router