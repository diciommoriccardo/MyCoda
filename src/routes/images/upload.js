import Router from 'express';
import path from 'path';
import Message from '../../models/message.model.js';
import multer, { MulterError } from 'multer';
import { s3Upload } from '../../helpers/aws.js';
import Session from '../../models/session.model.js';
import { FILES } from '../../config/config.js';

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if(!(mimetype && extname)) cb(new Error("Error: Image only!"))

    return cb(null,true);
  }

const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,  
    //limits: { fileSize: FILES.MAX_SIZE },
    fileFilter: function(_req, file, cb){
        checkFileType(file, cb);
    },
 }).single('image');
 
const router = Router();

router.post('/:id', upload, (req, res) => {

    upload(req, res, (err) => {
        if(err) res.status(500).json({
            message: err.message
        })
    })

    const { id, type } = req.user;
    const receiverId = req.params.id;
    const file = req.file;

    console.log("file", file)

    const session = {
        ...(type === 'user') ? { cfUtente: id, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: id}
    }

    new Session( session )
    .then(session => session.create())
    .then(session => {
        s3Upload(file)
        .then(data => {
            console.log(data)
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
                    readed: (result.stato === 'letto' ? true : false),
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