import config from '../config';
import Home from '../pages/home/home';
import EmployeesPage from '../pages/employees/employees-page';
import ErrorPage from '../pages/error-page/error-page';
import ReportPage from '../pages/report/report-page';
import LoginPage from '../pages/login/login';
import DepartmentPage from '../pages/department/department';
import SettingsPage from '../pages/settings/settings';
import BenefitPage from '../pages/benefit/benefit-page';
import {
  PieChartOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  DollarOutlined,
  ClusterOutlined,
  SettingOutlined
} from '@ant-design/icons';
const publicRoutes = [
  {
    path: config.routes.home,
    element: <Home />,
    pageIcon: <AppstoreOutlined />,
    label: 'Trang chủ',
    needShowSideMenu: true
  },
  {
    path: config.routes.employee,
    element: <EmployeesPage />,
    pageIcon: <UserOutlined />,
    label: 'Nhân viên',
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
    pageIcon: <BarChartOutlined />,
    label: 'Báo cáo',
    needShowSideMenu: true
  },
  {
    path: config.routes.department,
    element: <DepartmentPage />,
    pageIcon: <ClusterOutlined />,
    label: 'Phòng ban',
    needShowSideMenu: true
  },
  {
    path: config.routes.benefit,
    pageIcon: <DollarOutlined />,
    element: <BenefitPage />,
    label: 'Quyền lợi',
    needShowSideMenu: true
  },
  {
    path: config.routes.settings,
    element: <SettingsPage />,
    pageIcon: <SettingOutlined />,
    label: 'Phân quyền',
    needShowSideMenu: true
  },
  {
    path: config.routes.login,
    element: <LoginPage />,
    needShowSideMenu: false
  }
];

const privateRoutes = [
  config.routes.home,
  config.routes.report,
  config.routes.employee,
  config.routes.benefit,
  config.routes.department
];

export { publicRoutes, privateRoutes };
