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
                    id: result[0].id,
                    mittente: result[0].mittente,
                    location: result[0].content,
                    time: result[0].time,
                    stato: result[0].stato,
                    idSession: result[0].idSession,
                    tipo: result[0].tipo
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
})

export default router;