import Router from 'express';
import Session from '../../models/session.model.js';

const router = Router();

router.get('/open', (req, res) => {
    const { id, type } = req.user;
    const session = {
        ...(type === 'user' ? { cfUtente: id } : { pivaFarma: id })
    };

    new Session( session )
    .then(session => type === 'user' ? session.findOpenSessionByUser() : session.findOpenSessionByPharma())
    .then(result => { return res.status(201).json(result)})
    .catch(err => { return res.status(500).json({error: { message: err }})})

})

export default router