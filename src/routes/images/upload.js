import Router from 'express';
import Message from '../../models/message.model.js';
import multer from 'multer';
import { s3Upload } from '../../helpers/aws.js';
import Session from '../../models/session.model.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/:id', upload.single('image'), (req, res) => {
    const { id, type } = req.user;
    const receiverId = req.params.id;
    const file = req.file;

    const session = {
        ...(type === 'user') ? { cfUtente: id, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: id}
    }

    new Session( session )
    .then(session => session.create())
    .then(session => {
        s3Upload(file)
        .then(data => {
            const location = `https://api.server.mycoda.it/api/images/${data.key}`;
    
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
                    stato: result.stato,
                    idSession: result.idSession,
                    tipo: result.tipo
                }
            }))
        })
        .catch(err => {
            console.log(err)
            res.json({
                message: err
            })
        })
    })
    .catch(err => res.status(500).json(err))
})

export default router;