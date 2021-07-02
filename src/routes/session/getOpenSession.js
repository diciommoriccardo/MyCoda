import Router from 'express';
import Session from '../../models/session.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('/open', (req, res) => {
    const type = req.user.type
    
    switch (type) {
        case 'pharmacy':
            var session = {
                pivaFarma: req.user.id
            }
            break;
        case 'user':
            var session = {
                cfUtente: req.user.id
            }
            break;
    }

    new Session( session )
    .then(session => type == 'user' ? session.findOpenSessionByUser() : session.findOpenSessionByPharma())
    .then(result => { console.log(result); return res.status(201).json({result: result, message: SUCCESS_ITA.DEFAULT})})
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router