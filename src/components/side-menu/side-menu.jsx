import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { publicRoutes } from '../../routes';
import './side-menu.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, accountRoleState } from '../../recoil/store/account';
import { ExportOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import mainLogo from '../../assets/images/dthl_logo.png';
import { getPriorityRole } from '../../utils';

const SideMenu = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigation = useNavigate();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const accountRole = useRecoilValue(accountRoleState);

  const getDefaultMenuItems = useMemo(() => {
    let ROUTES_NEED_TO_SHOW = ['/', '/reports', '/employee', '/department', '/benefit', '/contract'];
    if (getPriorityRole(accountRole) === 'Admin') {
      const extraRoutes = ['/settings', '/notification'];
      ROUTES_NEED_TO_SHOW = [...ROUTES_NEED_TO_SHOW, ...extraRoutes];
    }
    return publicRoutes
      .filter(route => ROUTES_NEED_TO_SHOW.includes(route.path))
      .map(filteredRoute => ({ key: filteredRoute.path, icon: filteredRoute.pageIcon, label: filteredRoute.label }));
  }, [accountRole]);

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
        items={getDefaultMenuItems}
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
