import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';
import Pharmacy from '../../models/pharmacy.model.js';
import notification from '../../helpers/notifications.js';

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
        .then(result => {
            let data = []
            switch(type){
                case 'user':
                    new User({ cf: result.mittente }).then(user => user.findByCf())
                    .then(sender => {
                        console.log(sender)
                        new Pharmacy({
                            piva: receiverId
                        }).then(pharmacy => pharmacy.findByCf())
                        .then(row => {
                            data.push({
                                pushToken: row[0].notificationToken,
                                body: (result.tipo == 1 ) ? "📷 Foto" : result.content,
                                senderId: result.mittente,
                                sender: `${sender[0].nome} ${sender[0].cognome}`
                            });
    
                            notification.setData(data)
                            .then(messages => notification.sendNotifications(messages))
                        })
                    })
                    break;
                case 'pharmacy':
                    new Pharmacy({ piva: result.mittente }).then(pharmacy => pharmacy.findByCf())
                    .then(sender => {
                        console.log(sender);
                        new User({
                            cf: receiverId
                        }).then(user => user.findByCf())
                        .then(row => {
                            data.push({
                                pushToken: row[0].notificationToken,
                                body: result.content,
                                senderId: result.mittente,
                                sender: sender[0].ragSociale
                            });
    
                            notification.setData(data)
                            .then(messages => notification.sendNotifications(messages))
                        })
                    })
                    break;
            }
            return res.status(201).json(result);
        })
        .catch(err => { return res.status(500).json(err); });
})

export default router