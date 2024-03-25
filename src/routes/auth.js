import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/user/auth', verifyToken, async (req, res) => {
    const uid = req.uid;
    try {
        if (!uid) {
            throw new Error('ID não informado!');
        }
        console.log(uid)
        // generate token and return it
        const payload = {
            id: uid,
        }

        const secret = process.env.JWT_CLIENT_SECRET;
        const token = jwt.sign(payload, secret);


        res.status(200).json({message: 'Usuário autenticado com sucesso!', token: token});
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Usuário não encontrado!') {
            res.status(404).json({message: error.message});
        } else if (error.message === 'ID não informado!') {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: error.message});
        }
    }
});

export default router;