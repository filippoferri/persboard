export const getRequiredServerEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    const error = new Error(`${name} is not configured`);
    error.statusCode = 500;
    throw error;
  }

  return value;
};

export const getAppUrl = () => {
  const appUrl = process.env.APP_URL || 'http://localhost:3034';

  return appUrl.replace(/\/$/, '');
};
