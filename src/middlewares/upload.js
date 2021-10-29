import multer from 'multer';
import { FILES } from '../config/config.js';
import path from 'path';

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
    limits: { fileSize: FILES.MAX_SIZE },
    fileFilter: function(_req, file, cb){
        checkFileType(file, cb);
    },
 }).single('image');

export {
    upload
}