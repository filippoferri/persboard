// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  boards: icon('ic_boards'),
  projects: icon('ic_projects'),
  inspiration: icon('ic_inspiration'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: '',
    items: [
      { title: 'Welcome', path: PATH_DASHBOARD.welcome, icon: ICONS.projects },
      // { title: 'Boards', path: PATH_DASHBOARD.boards, icon: ICONS.boards },
      // { title: 'Inspiration', path: PATH_DASHBOARD.inspiration, icon: ICONS.inspiration },
      // { title: 'One', path: PATH_DASHBOARD.one, icon: ICONS.dashboard },
      // { title: 'Two', path: PATH_DASHBOARD.two, icon: ICONS.ecommerce },
      // { title: 'Three', path: PATH_DASHBOARD.three, icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
/*   {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Four', path: PATH_DASHBOARD.user.four },
          { title: 'Five', path: PATH_DASHBOARD.user.five },
          { title: 'Six', path: PATH_DASHBOARD.user.six },
        ],
      },
    ],
  }, */
];

export default navConfig;
