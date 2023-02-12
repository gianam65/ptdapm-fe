import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { publicRoutes } from './routes';

function App() {
  const publicRouter = createBrowserRouter(publicRoutes);
  return <RouterProvider router={publicRouter} />;
}

export default App;
