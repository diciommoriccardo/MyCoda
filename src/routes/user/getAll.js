import Router from 'express';
import User from '../../models/user.model.js';

const router = new Router();

router.get('/', (req, res) => {
    new User(req.user)
        .then(user => user.getAll())
        .then(result => { return res.status(201).json(result); })
        .catch(err => { return res.status(500).json({ error: { message: err } }); });
})

export default router;