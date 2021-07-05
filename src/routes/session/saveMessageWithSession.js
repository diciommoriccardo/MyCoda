import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:id/message', (req, res) => {
    if (!req.body.content || req.body.content == '') return res.status(400).json({ error: { message: 'Content cannot be empty' } });
    const type = req.user.type;
    const id = req.user.id;
    const session = {
        ...(type === 'user' ? { cfUtente: id, pivaFarma: req.params.id } : { pivaFarma: id, cfUtente: req.params.id} )
    };

    new Session( session )
        .then(session => session.findOpenSessionById())
        .then(result => result.length === 0 ? new Session(session).then(session => session.create()) : result)
        .then(result => new Message({
            cfUtente: result[0].cfUtente,
            pivaFarma: result[0].pivaFarma,
            content: req.body.content
        }))
        .then((message) => { console.log(message); return message.create() })
        .then((result) => res.status(201).json(result))
        .catch(err => { return res.status(500).json({error: {message: err}})})
})

export default router