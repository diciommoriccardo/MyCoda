import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';

const router = Router();

router.get('/:piva', function(req, res) {

    new Pharmacy({piva: req.params.piva})
        .then(pharmacy => pharmacy.findByCf())
        .then(result => {
            const {piva, ragSociale, indirizzo, email} = result[0]
            
            return res.status(200).json({
                piva,
                ragSociale,
                indirizzo,
                email
            });
        })
        .catch(err => { return res.status(500).json({ error: { message: err } }); });
});

export default router;