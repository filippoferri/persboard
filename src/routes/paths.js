// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};


export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  welcome: path(ROOTS_DASHBOARD, '/welcome'),
  steps: path(ROOTS_DASHBOARD, '/steps'),
  projects: {
    root: path(ROOTS_DASHBOARD, '/projects'),
    newProject: path(ROOTS_DASHBOARD, '/projects/new'),
    question: path(ROOTS_DASHBOARD, '/projects/question'),
    advice: path(ROOTS_DASHBOARD, '/projects/advice'),
  },
  directors: {
    root: path(ROOTS_DASHBOARD, '/directors'),
    newDirector: path(ROOTS_DASHBOARD, '/directors/new'),
  },
  boards: path(ROOTS_DASHBOARD, '/boards'),
  advices: {
    root: path(ROOTS_DASHBOARD, '/advices'),
    boardroom: path(ROOTS_DASHBOARD, '/advices/boardroom'),
    view: (aid) => path(ROOTS_DASHBOARD, `/advices/boardroom/${aid}`),
  },
  billing: {
    root: path(ROOTS_DASHBOARD, '/billing'),
  },
  one: path(ROOTS_DASHBOARD, '/one'),
  two: path(ROOTS_DASHBOARD, '/two'),
  three: path(ROOTS_DASHBOARD, '/three'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    settings: path(ROOTS_DASHBOARD, '/user/account'),
    four: path(ROOTS_DASHBOARD, '/user/four'),
    five: path(ROOTS_DASHBOARD, '/user/five'),
    six: path(ROOTS_DASHBOARD, '/user/six'),
  },
};
