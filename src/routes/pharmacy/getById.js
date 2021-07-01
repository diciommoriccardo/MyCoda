import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';

const router = Router();

router.get('/me', function(req, res) {

    new Pharmacy({piva: req.user.id})
        .then(pharmacy => pharmacy.findByCf())
        .then(result => {
            
            const {ragSociale, indirizzo, email} = result[0]
            
            return res.status(201).json({
                ragSociale,
                indirizzo,
                email
            });
        })
        .catch(err => { return res.status(500).json({ error: { message: err } }); });
});

export default router;