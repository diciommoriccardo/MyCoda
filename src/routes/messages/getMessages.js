import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';

const router = Router();

router.get('/:id', (req, res) => {
    const { id, type } = req.user;
    const receiverId = req.params.id;

    const session = {
        ...(type === 'user') ? {cfUtente: id, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: id}
    };

    new Session( session )
        .then(session => session.findByBoth())
        .then(result => Promise.all(result.map(({id}) => 
            new Promise((resolve, reject) => {
                new Message({ idSession: id })
                    .then(message => message.findBySession())
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            })
        )))
        .then(messages => { return res.status(201).json({messages}); })
        .catch(err => res.status(500).json(err));
})

export default router