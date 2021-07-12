import Router from 'express';
import jwt from '../../helpers/jwt.js';
import Pharmacy from '../../models/pharmacy.model.js';

const router = Router();

router.post('/login', function(req, res){
    if (!req.body) return res.status(400).json({error: {message: 'Content cannot be empty'}});
    if (!req.body.piva || !req.body.password) 
        return res.status(400).json({error: {message: 'P.IVA and password are required'}});

    new Pharmacy ( req.body )
        .then(pharmacy => pharmacy.login())
        .then(row => {
            const { pIva, ragSociale, indirizzo, email, refresh_token } = row;
            var accessToken = jwt.signAccessToken({ id: pIva, type: "pharmacy" });
            return res.status(201).json({
                pIva,
                ragSociale,
                indirizzo,
                email,
                accessToken,
                refresh_token
            });
        })
        .catch(err => { return res.status(500).json({error: {message: err}}); });
});

export default router;