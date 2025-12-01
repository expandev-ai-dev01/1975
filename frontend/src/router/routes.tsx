import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { MainLayout } from '@/layouts/MainLayout';

const HomePage = lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.HomePage }))
);
const GradeRegistrationPage = lazy(() =>
  import('@/pages/GradeRegistration').then((module) => ({ default: module.GradeRegistrationPage }))
);
const GradeEditPage = lazy(() =>
  import('@/pages/GradeEdit').then((module) => ({ default: module.GradeEditPage }))
);
const GradeHistoryPage = lazy(() =>
  import('@/pages/GradeHistory').then((module) => ({ default: module.GradeHistoryPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFoundPage }))
);

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'grades/register',
        element: <GradeRegistrationPage />,
      },
      {
        path: 'grades/edit/:id',
        element: <GradeEditPage />,
      },
      {
        path: 'grades/history/:studentId',
        element: <GradeHistoryPage />,
      },
      {
        path: '*',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { routes };
