const admin = require('firebase-admin');
const path = require('path');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'C:\\keys\\portfolio-7ade3-16a9f2d88955';
    const serviceAccount = require(path.resolve(keyPath));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const firestore = admin.firestore();
    const user = process.argv[2] || 'test';
    const pass = process.argv[3] || 'test';
    const hash = await bcrypt.hash(pass, 10);
    await firestore.collection('admins').doc(user).set({ password: hash });
    console.log(`Admin creado: user=${user} pass=${pass}`);
    process.exit(0);
  } catch (e) {
    console.error('Error creando admin con hash:', e);
    process.exit(1);
  }
})();
