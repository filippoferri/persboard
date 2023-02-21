// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  welcome: path(ROOTS_DASHBOARD, '/welcome'),
  projects: {
    root: path(ROOTS_DASHBOARD, '/projects'),
    newProject: path(ROOTS_DASHBOARD, '/projects/new'),
    question: path(ROOTS_DASHBOARD, '/projects/question'),
    advice: path(ROOTS_DASHBOARD, '/projects/advice'),
  },
  boards: path(ROOTS_DASHBOARD, '/boards'),
  inspiration: path(ROOTS_DASHBOARD, '/inspiration'),
  one: path(ROOTS_DASHBOARD, '/one'),
  two: path(ROOTS_DASHBOARD, '/two'),
  three: path(ROOTS_DASHBOARD, '/three'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    four: path(ROOTS_DASHBOARD, '/user/account'),
    four: path(ROOTS_DASHBOARD, '/user/four'),
    five: path(ROOTS_DASHBOARD, '/user/five'),
    six: path(ROOTS_DASHBOARD, '/user/six'),
  },
};
