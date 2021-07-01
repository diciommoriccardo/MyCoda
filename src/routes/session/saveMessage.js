import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:id/message', (req, res) => {
    const id = req.user.id
    console.log(id)

    switch (id.length) {
        case 11:
            var s= {
                pivaFarma: id,
                cfUtente: req.params.id
            }
            break;
        case 16:
            var s = {
                pivaFarma: req.params.id,
                cfUtente: id
            }
            break;
        default:
            return res.status(500).json({error: {message: "ID Errato"}})
    }

    console.log(s)

    new Session( s )
    .then(session => session.findOpenSession())
    .then(([result]) => {
        console.log(result)
        
        new Message({
            cfUtente: result.cfUtente,
            pivaFarma: result.pivaFarma,
            content: req.body.content
        })
        .then(message => message.create())
        .then(resultMessage => { return res.status(201).json({result: resultMessage, message: SUCCESS_ITA.DEFAULT}) })
    })
    
    .catch(err => { return res.status(500).json({error: {message: err}})})
})

export default router