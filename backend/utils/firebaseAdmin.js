const admin = require('firebase-admin');

let firebaseAdminApp = null;

function getFirebaseAdmin() {
  if (firebaseAdminApp) return firebaseAdminApp;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error('Firebase Admin chưa được cấu hình. Thiếu FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL hoặc FIREBASE_PRIVATE_KEY.');
  }

  firebaseAdminApp = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });

  return firebaseAdminApp;
}

async function verifyFirebaseIdToken(idToken) {
  const app = getFirebaseAdmin();
  return app.auth().verifyIdToken(idToken);
}

module.exports = { getFirebaseAdmin, verifyFirebaseIdToken };
