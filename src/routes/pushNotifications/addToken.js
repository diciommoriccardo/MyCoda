import Router from 'express';
import User from '../../models/user.model.js';
import Pharmacy from '../../models/payment.model.js';
import { customError, InternalError } from '../../helpers/Errors.js';

const router = Router();

router.post('/:token', (req, res) => {
    const { id, type } = req.user;
    const token = req.params.token;

    const data = {
        ...(type === 'user') ? { cf: id, notificationToken: token} : { pIva: id, notificationToken: token}
    }

    console.log(data)

    switch(type){
        case 'user':
            new User(data)
            .then((result) => result.addToken())
            .then((result) => res.status(200).json(result))
            .catch((error) => {console.log(error); return res.status(500).json(error)})
            break;
        case 'pharmacy':
            new Pharmacy((data))
            .then((pharmacy) => pharmacy.addToken(pharmacy))
            .then((result) => res.status(200).json(result))
            .catch((error) => res.status(500).json(error))
            break;
        default:
            res.status(500).json({error: {
                data: new InternalError("Notification Token").data,
                message: "Invalid JWT type"
            }})
    }
})

export default router;