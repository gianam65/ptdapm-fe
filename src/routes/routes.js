import config from '../config';
import Home from '../pages/home/home';
import EmployeesPage from '../pages/employees/employees-page';
import ErrorPage from '../pages/error-page/error-page';
import ReportPage from '../pages/report/report-page';
import LoginPage from '../pages/login/login';
import DepartmentPage from '../pages/department/department';
import SettingsPage from '../pages/settings/settings';
import BenefitPage from '../pages/benefit/benefit-page';
import ContractPage from '../pages/contract/contract';
import NotificationPage from '../pages/notification/notification';
import {
  PieChartOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  DollarOutlined,
  ClusterOutlined,
  SettingOutlined,
  AuditOutlined
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
    path: config.routes.contract,
    element: <ContractPage />,
    pageIcon: <AuditOutlined />,
    label: 'Hợp đồng',
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
    path: config.routes.notifcation,
    pageIcon: <DollarOutlined />,
    element: <NotificationPage />,
    label: 'Thông báo',
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

const privateRoutes = [config.routes.notifcation, config.routes.settings];

export { publicRoutes, privateRoutes };
