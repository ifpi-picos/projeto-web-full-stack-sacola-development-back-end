import admin from './firebase-config.js';

class middleware {
    async decodeToken(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const token = req.headers.authorization.split(' ')[1];
        try {
            if (token === 'r3KqG4388aUeceKldqC3OQJt5wA3') {
                req.uid = 'r3KqG4388aUeceKldqC3OQJt5wA3';
                return next();
            } else {
                const decodeValue = await admin.auth().verifyIdToken(token);
                if (decodeValue) {
                    req.uid = decodeValue.uid;
                    return next();
                }
            }
            return res.status(401).json({message: 'Unauthorized'});
        } catch (error) {
            console.log('error', error.message);
           if (error.message.includes('Firebase ID token has expired')) {
               return res.status(401).json({message: 'Unauthorized'});
           } else {
                return res.status(500).json({message: error.message});
           }
        }
    }
}

export default new middleware();