import config from '../config';
import Home from '../pages/home/home';
import EmployeesPage from '../pages/employees/employees-page';
import ErrorPage from '../pages/error-page/error-page';
import ReportPage from '../pages/report/report-page';
import LoginPage from '../pages/login/login';
import SalaryPage from '../pages/salary/salary';
import DepartmentPage from '../pages/department/department';
import {
  ContainerOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  DollarOutlined,
  ClusterOutlined
} from '@ant-design/icons';
const publicRoutes = [
  {
    path: config.routes.home,
    element: <Home />,
    pageIcon: <AppstoreOutlined />,
    label: 'Dashboard',
    needShowSideMenu: true
  },
  {
    path: config.routes.overview,
    element: <Home />,
    pageIcon: <ContainerOutlined />,
    label: 'Overview',
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
    pageIcon: <BarChartOutlined />,
    label: 'Reports',
    needShowSideMenu: true
  },
  {
    path: config.routes.department,
    element: <DepartmentPage />,
    pageIcon: <ClusterOutlined />,
    label: 'Department',
    needShowSideMenu: true
  },
  {
    path: config.routes.salary_rank,
    element: <SalaryPage />,
    pageIcon: <DollarOutlined />,
    label: 'Salary',
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
  config.routes.salary_rank,
  config.routes.department
];

export { publicRoutes, privateRoutes };
