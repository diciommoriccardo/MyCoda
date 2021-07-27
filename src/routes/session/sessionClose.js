import Router from 'express';
import Session from '../../models/session.model.js';

const router = Router();
router.patch('/close', (req, res) => {
    const id = req.user.id;
    const session = {
        cfUtente: id
    }

    new Session(session)
    .then(session => session.findOpenSessionByUser())
    .then(result => new Session({id:result[0].id}))
    .then(session => session.sessionClose())
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))
})

export default router