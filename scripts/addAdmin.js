const admin = require('firebase-admin');
const path = require('path');

(async () => {
  try {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'C:\\keys\\portfolio-7ade3-16a9f2d88955';
    const serviceAccount = require(path.resolve(keyPath));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const firestore = admin.firestore();
    await firestore.collection('admins').doc('test').set({ password: 'test' });
    console.log('Admin de prueba creado: user=test pass=test');
    process.exit(0);
  } catch (e) {
    console.error('Error creando admin de prueba:', e);
    process.exit(1);
  }
})();
