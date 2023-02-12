import config from '../config';
import Home from '../pages/home/home';
import ErrorPage from '../pages/error-page/error-page';

const publicRoutes = [
  { path: config.routes.home, element: <Home /> },
  { path: config.routes.error, element: <ErrorPage /> }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
