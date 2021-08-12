import multer from 'multer';

const upload = (cfUtente) => {
    const upload = multer({ dest: `uploads/${cfUtente}` });
    return upload;
}

export default upload