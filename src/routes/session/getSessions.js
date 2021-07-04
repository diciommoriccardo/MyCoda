import Router from 'express';
import Session from '../../models/session.model.js';

const router = Router();

router.get('', (req, res) => {
    const { id, type } = req.user;
    const session = {
        ...(type === 'user' ? { cfUtente: id } : { pivaFarma: id })
    };
    
    new Session( session )
    .then(session => type === 'user' ? session.findByUser() : session.findByPharma())
    .then(result => { return res.status(201).json(result); })
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router