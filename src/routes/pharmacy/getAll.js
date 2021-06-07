import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';

const router = new Router();

router.get('/', (req, res) => {
    new Pharmacy(req.body)
        .then(pharmacy => pharmacy.getAll())
        .then(result => { return res.status(201).json(result); })
        .catch(err => { return res.status(500).json({ error: { message: err } }); });
})

export default router;