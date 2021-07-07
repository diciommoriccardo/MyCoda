import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import { SUCCESS_ITA } from '../../config/constants.js';

const router = Router();

router.get('/:id', (req, res) => {
    const { id, type } = req.user;
    const receiverId = req.params.id;

    const session = {
        ...(type === 'user') ? {cfUtente: id, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: id}
    };

    new Session( session )
    .then(session => session.findOpenSessionByBoth())
    .then(result => new Message({ idSession: result.id }))
    .then(message => message.findBySession())
    .then(messages => res.status(201).json({messages}))
    // .then(result => {
    //     return Promise.all(result.map(({id}) => 
    //         new Promise((resolve, reject) => {
    //             new Message({ idSession: id })
    //             .then(message => {console.log("message: ");console.log(message); return message.findBySession()})
    //             .then(result => {console.log("result: ");console.log(result); return resolve(result)})
    //             .catch(err => reject(err))
    //         })
    //     ))
    // })
    // .then(messages => {console.log("messages: ");console.log(messages); return res.status(201).json({messages})})
    .catch(err => res.status(500).json(err))
})

export default router