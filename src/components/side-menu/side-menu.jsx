import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { publicRoutes } from '../../routes';
import './side-menu.scss';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/store/account';
import { ExportOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import mainLogo from '../../assets/images/dthl_logo.png';

const ROUTES_NEED_TO_SHOW = ['/', '/reports', '/employee', '/department', '/benefit', '/settings','/contract'];
const DEFAULT_MENU_ITEMS = publicRoutes
  .filter(route => ROUTES_NEED_TO_SHOW.includes(route.path))
  .map(filteredRoute => ({ key: filteredRoute.path, icon: filteredRoute.pageIcon, label: filteredRoute.label }));

const SideMenu = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigation = useNavigate();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const handleNavigateToAnotherPage = e => {
    const redirectURL = `${e.key}`;

    navigation(redirectURL);
  };

  const defaultActiveMenu = useMemo(() => {
    return pathname ? pathname : '/';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    setAccessToken('');
  };
  return (
    <div className="side__menu-container">
      <img src={mainLogo} alt="TLU LOGO" className="side__menu-logo" />
      <Menu
        defaultSelectedKeys={[defaultActiveMenu]}
        mode="inline"
        theme="dark"
        items={DEFAULT_MENU_ITEMS}
        onClick={handleNavigateToAnotherPage}
      />
      {accessToken && (
        <div className="log__out-section" onClick={handleLogout}>
          <ExportOutlined />
          Đăng xuất
        </div>
      )}
    </div>
  );
};
export default SideMenu;
