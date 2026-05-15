import { getAuth } from 'firebase/auth';

const getSafeUser = (user = {}) => ({
  firstName: user.firstName || user.displayName?.split(' ')[0] || 'there',
  myProfile: user.myProfile || null,
});

export const requestBoardroomAi = async (action, payload = {}) => {
  const idToken = await getAuth().currentUser?.getIdToken();

  if (!idToken) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch('/api/ai/boardroom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      action,
      ...payload,
      user: payload.user ? getSafeUser(payload.user) : undefined,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Boardroom AI request failed');
  }

  return data.result;
};

export default requestBoardroomAi;
