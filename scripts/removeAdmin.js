const admin = require('firebase-admin');
const path = require('path');

(async () => {
  try {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'C:\\keys\\portfolio-7ade3-16a9f2d88955';
    const serviceAccount = require(path.resolve(keyPath));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const firestore = admin.firestore();
    const user = process.argv[2] || 'test';
    await firestore.collection('admins').doc(user).delete();
    console.log(`Admin eliminado: user=${user}`);
    process.exit(0);
  } catch (e) {
    console.error('Error eliminando admin:', e);
    process.exit(1);
  }
})();
