import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';

const router = Router();

router.post('/:id', (req,res) => {
    if(!req.body.content || req.body.content == '') {return res.status(500).json({error: {message: "Content must be send"}})}
    if(!req.body.msgType || req.body.msgType == '') {return res.status(500).json({error: {message: "Message type must be send"}})}

    const { id, type } = req.user;
    const receiverId = req.params.id;
    const {content, msgType} = req.body;
    
    const session = {
        ...(type === 'user') ? { cfUtente: id, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: id}
    }

    new Session( session )
        .then(session => session.create())
        .then(result => new Message({
            mittente: id,
            content: content,
            tipo: msgType,
            idSession: result.id
        }))
        .then(message => message.create())
        .then(result => res.status(201).json(result))
        .catch(err => { return res.status(500).json(err); });
})

export default router