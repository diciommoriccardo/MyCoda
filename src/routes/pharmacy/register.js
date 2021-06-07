import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js'

const router = Router();

router.post('/register', function(req, res){
    if (!req.body) return res.status(400).json({error: {message: 'Content cannot be empty'}});

    new Pharmacy(req.body)
        .then(pharmacy => pharmacy.register())
        .then(result => { return res.status(201).json(result); })
        .catch((err) => { return res.status(500).json({ error: { message: err } }); });
});

export default router;