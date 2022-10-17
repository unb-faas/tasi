import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import DashboardApp from './pages/Dashboard/DashboardApp';
import WordReplace from './pages/WordReplace/Index';
import WordReplaceForm from './pages/WordReplace/Form';
import WordFilter from './pages/WordFilter/Index';
import WordFilterForm from './pages/WordFilter/Form';
import NotFound from './pages/Common/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        
        { path: 'wordreplace', element: <WordReplace /> },
        { path: 'wordreplace/create', element: <WordReplaceForm /> },
        { path: 'wordreplace/:id', element: <WordReplaceForm /> },

        { path: 'wordfilter/create', element: <WordFilterForm /> },
        { path: 'wordfilter/:id', element: <WordFilterForm /> },
        { path: 'wordfilter', element: <WordFilter /> },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
