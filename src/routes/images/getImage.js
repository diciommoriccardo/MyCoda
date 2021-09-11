import Router from 'express';
import { downloadObject } from '../../helpers/aws.js';

const router = Router();

router.get('/:key', (req, res) => {
    const imageKey = req.params.key;

    downloadObject(imageKey)
    .then(image => res.write(image.Body))
    .catch(err => res.status(500).json(err))

})

export default router;