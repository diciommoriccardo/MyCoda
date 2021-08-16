import Router from 'express';
import Message from '../../models/message.model.js';
import multer from 'multer';
import { s3Upload } from '../../helpers/aws.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('', upload.single('image'), (req, res) => {
    const {id} = req.user;
    const file = req.file;
    const {data, idSession} = req.body;

    s3Upload(file)
    .then(data => {
        console.log(data);
        const location = `https://api.server.mycoda.it/api/images/${data.key}`;

        const message = {
            content: location,
            tipo: 1,
            mittente: id,
            idSession: idSession
        }

        new Message(message)
        .then(message => message.create())
        .then(result => res.status(201).json({
            image: {
                key: data.key
            },
            message: result
        }))
    })
    .catch(err => {
        res.json({
            message: err
        })
    })

    console.log(file);
})

export default router;