import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Browse from './components/Browse';
import Search from './components/Search';
import ErrorBoundary from './components/ErrorBoundary';
import AnimeDetails from './components/AnimeDetails';
import AIRecommendations from './components/AIRecommendations';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Login /> },
      { path: '/browse', element: <Browse /> },
      { path: '/search', element: <Search /> },
      { path: '/anime/:id', element: <AnimeDetails /> },
      { path: '/ai-recommendations', element: <AIRecommendations /> },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={appRouter} />
    </ErrorBoundary>
  );
}

export default App;
