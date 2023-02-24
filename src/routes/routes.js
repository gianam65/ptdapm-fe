import config from '../config';
import Home from '../pages/home/home';
import EmployeesPage from '../pages/employees/employees-page';
import ErrorPage from '../pages/error-page/error-page';
import ReportPage from '../pages/report/report-page';
import LoginPage from '../pages/login/login';
import { ContainerOutlined, PieChartOutlined, DesktopOutlined, UserOutlined } from '@ant-design/icons';
const publicRoutes = [
  {
    path: config.routes.home,
    element: <Home />,
    pageIcon: <ContainerOutlined />,
    label: 'Home',
    needShowSideMenu: true
  },
  {
    path: config.routes.employee,
    element: <EmployeesPage />,
    pageIcon: <UserOutlined />,
    label: 'Employees',
    needShowSideMenu: true
  },
  {
    path: config.routes.error,
    element: <ErrorPage />,
    pageIcon: <PieChartOutlined />,
    needShowSideMenu: false
  },
  {
    path: config.routes.report,
    element: <ReportPage />,
    pageIcon: <DesktopOutlined />,
    label: 'Reports',
    needShowSideMenu: true
  },
  {
    path: config.routes.login,
    element: <LoginPage />,
    needShowSideMenu: false
  }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
