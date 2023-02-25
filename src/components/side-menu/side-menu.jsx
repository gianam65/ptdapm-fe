import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { publicRoutes } from '../../routes';
import './side-menu.scss';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/store/account';
import { ExportOutlined } from '@ant-design/icons';

const ROUTES_NEED_TO_SHOW = ['/', '/home', '/reports', '/employee'];
const DEFAULT_MENU_ITEMS = publicRoutes
  .filter(route => ROUTES_NEED_TO_SHOW.includes(route.path))
  .map(filteredRoute => ({ key: filteredRoute.path, icon: filteredRoute.pageIcon, label: filteredRoute.label }));

const SideMenu = () => {
  const navigation = useNavigate();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const handleNavigateToAnotherPage = e => {
    const redirectURL = `${e.key}`;

    navigation(redirectURL);
  };

  const handleLogout = () => {
    setAccessToken('');
  };
  return (
    <div className="side__menu-container">
      <Menu
        defaultSelectedKeys={['/']}
        mode="inline"
        theme="dark"
        items={DEFAULT_MENU_ITEMS}
        onClick={handleNavigateToAnotherPage}
      />
      {accessToken && (
        <div className="log__out-section" onClick={handleLogout}>
          <ExportOutlined />
          Logout
        </div>
      )}
    </div>
  );
};
export default SideMenu;
