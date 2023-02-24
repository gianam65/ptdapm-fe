import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { publicRoutes } from '../../routes';
import './side-menu.scss';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/store/account';
import { useMemo } from 'react';
import { ExportOutlined } from '@ant-design/icons';

const ROUTES_NEED_TO_SHOW = ['/', '/home', '/reports', '/employee'];
const DEFAULT_MENU_ITEMS = publicRoutes
  .filter(route => ROUTES_NEED_TO_SHOW.includes(route.path))
  .map(filteredRoute => ({ key: filteredRoute.path, icon: filteredRoute.pageIcon, label: filteredRoute.label }));

const SideMenu = () => {
  const navigation = useNavigate();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const menusToRender = useMemo(() => {
    return accessToken
      ? [...DEFAULT_MENU_ITEMS, { key: '/logout', label: 'Logout', icon: <ExportOutlined /> }]
      : DEFAULT_MENU_ITEMS;
  }, [accessToken]);

  const handleNavigateToAnotherPage = e => {
    const redirectURL = `${e.key}`;
    if (redirectURL === '/logout') {
      setAccessToken('');
      return;
    }
    navigation(redirectURL);
  };
  return (
    <div className="side__menu-container">
      <Menu
        defaultSelectedKeys={['home']}
        mode="inline"
        theme="dark"
        items={menusToRender}
        onClick={handleNavigateToAnotherPage}
      />
    </div>
  );
};
export default SideMenu;
