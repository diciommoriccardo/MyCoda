import Router from 'express';
import Session from '../../models/session.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('', (req, res) => {
    const type = req.user.type;
    const id = req.user.id;
    
    switch (type) {
        case 'pharmacy':
            var session = {
                pivaFarma: id
            }
            break;
        case 'user':
            var session = {
                cfUtente: id
            }
            break;
    }

    new Session( session )
    .then(session => type == 'user' ? session.findByUser() : session.findByPharma())
    .then(result => { console.log(result); return res.status(201).json({result: result, message: SUCCESS_ITA.DEFAULT})})
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router