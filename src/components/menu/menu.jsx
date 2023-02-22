import { ContainerOutlined, PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  };
}
const items = [
  getItem('Home page', 'home', <PieChartOutlined />),
  getItem('Employee', 'employee', <DesktopOutlined />),
  getItem('Error', 'error', <ContainerOutlined />)
];
const SideMenu = () => {
  //   const navigate = useNavigate();
  const handleNavigateToAnotherPage = e => {
    console.log('e :>> ', e);
    // navigate(`/${e}`);
  };
  return (
    <div className="side__menu-container">
      <Menu
        defaultSelectedKeys={['home']}
        mode="inline"
        theme="dark"
        items={items}
        onClick={handleNavigateToAnotherPage}
      />
    </div>
  );
};
export default SideMenu;
