import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';

const router = new Router();

router.get('', (req, res) => {
    new Pharmacy()
        .then(pharmacy => pharmacy.getAll())
        .then(result => { return res.status(201).json(result.map(pharmacy => {
            const { pIva, email, indirizzo, ragSociale } = pharmacy;
            return { pIva, email, indirizzo, ragSociale };
        })); })
        .catch(err => { return res.status(500).json({ error: { message: err } }); });
})

export default router;