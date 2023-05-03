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
  yourBoard: icon('ic_boards'),
  projects: icon('ic_projects'),
  inspiration: icon('ic_inspiration'),
  chat: icon('ic_chat'),
  menuItem: icon('ic_menu_item'),
  faq: icon('ic_faq'),
  directors: icon('ic_directors'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: '',
    items: [
      { title: 'New Advice', path: PATH_DASHBOARD.welcome, icon: ICONS.menuItem },
      { title: 'Advice Hub', path: PATH_DASHBOARD.advices.root, icon: ICONS.chat },
      { title: 'Your Board', path: PATH_DASHBOARD.yourBoard.root, icon: ICONS.yourBoard },
      // { title: 'AI Directors', path: PATH_DASHBOARD.directors.root, icon: ICONS.directors },
      // { title: 'One', path: PATH_DASHBOARD.one, icon: ICONS.dashboard },
      // { title: 'Two', path: PATH_DASHBOARD.two, icon: ICONS.ecommerce },
      // { title: 'Three', path: PATH_DASHBOARD.three, icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'resources',
    items: [
      { title: 'About', path: PATH_DASHBOARD.about, icon: ICONS.inspiration },
      { title: 'FAQ', path: PATH_DASHBOARD.faq, icon: ICONS.faq },
    ],
  },
];

export default navConfig;