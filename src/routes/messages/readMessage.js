import Message from "../../models/message.model.js";
import Router from 'express';

const router = new Router();

router.post('/:id/read', (req, res) => {
    const id = req.params.id;
    const mittente = req.user.id;

    const message = {
        id,
        mittente
    }

    new Message(message)
    .then(message => {console.log(message); return message.changeStatusById()})
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))
})

export default router