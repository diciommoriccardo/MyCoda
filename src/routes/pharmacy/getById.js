import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';

const router = Router();

router.get('/:id', function(req, res) {
    if(!req.body) return res.status(400).json({ error: { message:'Content cannot be empty'} });
    if(!req.body.piva) return res.status(400).json({ error: { message: 'P.IVA are required'} });

    new Pharmacy({piva: req.params.id})
        .then(pharmacy => pharmacy.findByCf())
        .then(result => { return res.status(201).json(result); })
        .catch(err => { return res.status(500).json({ error: { message: err } }); });
});

export default router;