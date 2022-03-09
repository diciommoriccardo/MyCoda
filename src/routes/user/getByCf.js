import Router from 'express';
import User from '../../models/user.model.js';

const router = Router();

router.get('/:cf', function(req, res) {
    new User({cf: req.params.cf})
    .then(user => user.findByCf())
    .then(row => {
        const { cf, nome, cognome, numTel, email } = row[0];

        return res.status(200).json({
            cf,
            nome,
            cognome,
            numTel,
            email,
        });
    })
    .catch(err => { return res.status(500).json({error: { message: err}})})
});

export default router;