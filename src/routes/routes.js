import config from '../config';
import Home from '../pages/home/home';
import Employee from '../pages/employees/listEmployee/listEmployee';
import ErrorPage from '../pages/error-page/error-page';
import ReportPage from '../pages/report/report-page';
import BenefitPage from '../pages/benefit/benefit-page';
const publicRoutes = [
  { path: config.routes.home, element: <Home /> },
  { path: config.routes.employee, element: <Employee /> },
  { path: config.routes.error, element: <ErrorPage /> },
  { path: config.routes.report, element: <ReportPage /> },
  { path: config.routes.benefit, element: <BenefitPage /> },


];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
