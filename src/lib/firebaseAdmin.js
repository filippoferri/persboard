import admin from 'firebase-admin';

const normalizePrivateKey = (key) => key?.replace(/\\n/g, '\n');

const getFirebaseAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
};

export const getAdminAuth = () => getFirebaseAdminApp().auth();

export const getAdminDb = () => getFirebaseAdminApp().firestore();

export const { FieldValue } = admin.firestore;
