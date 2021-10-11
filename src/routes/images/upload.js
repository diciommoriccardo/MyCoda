import Router from 'express';
import path from 'path';
import Message from '../../models/message.model.js';
import multer, { MulterError } from 'multer';
import { s3Upload } from '../../helpers/aws.js';
import Session from '../../models/session.model.js';
import { upload } from '../../middlewares/upload.js';
 
const router = Router();

router.post('/:id', upload, (req, res) => {

    upload(req, res, (err) => {
        if(err) res.status(500).json({
            message: err.message
        })
    })

    const { id, type } = req.user;
    const receiverId = req.params.id.toLowerCase();
    const file = req.file;

    const session = {
        ...(type === 'user') ? { cfUtente: id, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: id}
    }

    new Session( session )
    .then(session => session.create())
    .then(session => {
        s3Upload(file)
        .then(url => {
            const location = url;
    
            const message = {
                content: location,
                tipo: 1,
                mittente: id,
                idSession: session.id
            }

            new Message(message)
            .then(message => message.create())
            .then(result => res.status(201).json({
                message: {
                    id: result.id,
                    mittente: result.mittente,
                    location: result.content,
                    time: result.time,
                    readed: (result.stato === 'letto' ? true : false),
                    idSession: result.idSession,
                    tipo: result.tipo
                }
            }))
        })
        .catch(err => {
            res.json({
                message: err
            })
        })
    })
    .catch(err => res.status(500).json(err))
})

export default router;