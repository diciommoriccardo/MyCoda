import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';

const router = new Router();

router.get('', (req, res) => {
    new Pharmacy()
        .then(pharmacy => pharmacy.getAll())
        .then(result => res.status(200).json(result.map(pharmacy => {
            const { piva, email, indirizzo, ragSociale } = pharmacy;
            return { piva, email, indirizzo, ragSociale };
        })) )
        .catch(err => { return res.status(500).json({ error: { message: err } }); });
})

export default router;