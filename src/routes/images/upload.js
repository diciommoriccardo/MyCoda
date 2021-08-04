import Router from 'express';
import Message from '../../models/message.model.js';
import multer from 'multer';
import { s3Upload } from '../../helpers/aws.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/upload', upload.single('image'), (req, res) => {

    const file = req.file;
    const data = req.body;

    s3Upload(file)
    .then(data => {
        console.log(data);
        res.json({
            message: "ok"
        })
    })
    .catch(err => {
        res.json({
            message: err
        })
    })

    console.log(file);
})

export default router;