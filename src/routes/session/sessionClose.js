import Router from 'express';
import Session from '../../models/session.model.js';

const router = Router();
router.post('/:id/close', (req, res) => {
    const {id, type} = req.user;
    const receiverId = req.params.id;
    const session = {
        ...(type === 'user' ? {cfUtente: id, pivaFarma: receiverId} : {pivaFarma: id, cfUtente: receiverId})
    }

    new Session(session)
    .then(session => session.findOpenSessionByBoth())
    .then(result => new Session({id:result[0].id}))
    .then(session => session.sessionClose())
    .then(result => res.status(200).json(result))
    .catch(err => res.status(err.data.status).json({error: err.data}))
})

export default router