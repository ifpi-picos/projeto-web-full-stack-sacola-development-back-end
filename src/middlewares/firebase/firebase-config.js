import admin from 'firebase-admin';
import serviceAccount from './ServiceAccount.js';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;