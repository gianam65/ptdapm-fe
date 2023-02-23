import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { publicRoutes } from '../../routes';

import './side-menu.scss';

const ROUTES_NEED_TO_SHOW = ['/', '/home', '/reports', '/employee'];
const DEFAULT_MENU_ITEMS = publicRoutes
  .filter(route => ROUTES_NEED_TO_SHOW.includes(route.path))
  .map(filteredRoute => ({ key: filteredRoute.path, icon: filteredRoute.pageIcon, label: filteredRoute.label }));

const SideMenu = () => {
  const navigation = useNavigate();

  const handleNavigateToAnotherPage = e => {
    const redirectURL = `${e.key}`;
    navigation(redirectURL);
  };
  return (
    <div className="side__menu-container">
      <Menu
        defaultSelectedKeys={['home']}
        mode="inline"
        theme="dark"
        items={DEFAULT_MENU_ITEMS}
        onClick={handleNavigateToAnotherPage}
      />
    </div>
  );
};
export default SideMenu;
