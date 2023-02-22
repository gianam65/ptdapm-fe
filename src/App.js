import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { publicRoutes } from './routes';
import PageLayout from './layout';

function App() {
  const publicRouter = createBrowserRouter(publicRoutes);
  return (
    <PageLayout>
      <RouterProvider router={publicRouter} />
    </PageLayout>
  );
}

export default App;
