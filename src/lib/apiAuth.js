import { getAdminAuth } from './firebaseAdmin';

export const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const requireFirebaseUser = async (req) => {
  const token = getBearerToken(req);

  if (!token) {
    const error = new Error('Missing Authorization bearer token');
    error.statusCode = 401;
    throw error;
  }

  return getAdminAuth().verifyIdToken(token);
};
