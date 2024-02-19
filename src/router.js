import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

// Auth

const Login = Loader(lazy(() => import('src/content/applications/Auth/login')));

// Order

const Order = Loader(lazy(() => import('src/content/applications/Order')));
const CreateOrder = Loader(
  lazy(() => import('src/content/applications/Order/CreateOrder'))
);

const ViewDetails = Loader(
  lazy(() => import('src/content/applications/Order/ViewDetails'))
);

// Transactions
const Transactions = Loader(
  lazy(() => import('./content/applications/Transaction'))
);

const AddPayment = Loader(
  lazy(() => import('src/content/applications/Transaction/AddPayment'))
);

// Loans
const Loans = Loader(lazy(() => import('./content/applications/Loan')));
const CreateLoan = Loader(
  lazy(() => import('./content/applications/Loan/CreateLoan'))
);
const AddLoanAmount = Loader(
  lazy(() => import('./content/applications/Loan/AddLoanAmount'))
);

// EMI
const EMIs = Loader(lazy(() => import('./content/applications/EMI')));
const CreateEMI = Loader(
  lazy(() => import('./content/applications/EMI/CreateEMI'))
);
const EmiViewDetails = Loader(
  lazy(() => import('./content/applications/EMI/ViewDetails'))
);

// Report
const OrderReport = Loader(
  lazy(() => import('./content/applications/Reports'))
);

// const Overview = Loader(lazy(() => import('src/content/overview')));

// // Dashboards

// const Tasks = Loader(lazy(() => import('src/content/dashboards/Tasks')));

// // Applications

// const Messenger = Loader(
//   lazy(() => import('src/content/applications/Messenger'))
// );
// const Transactions = Loader(
//   lazy(() => import('src/content/applications/Transactions'))
// );
// const UserProfile = Loader(
//   lazy(() => import('src/content/applications/Users/profile'))
// );
// const UserSettings = Loader(
//   lazy(() => import('src/content/applications/Users/settings'))
// );

// // Components

// const Buttons = Loader(
//   lazy(() => import('src/content/pages/Components/Buttons'))
// );
// const Modals = Loader(
//   lazy(() => import('src/content/pages/Components/Modals'))
// );
// const Accordions = Loader(
//   lazy(() => import('src/content/pages/Components/Accordions'))
// );
// const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
// const Badges = Loader(
//   lazy(() => import('src/content/pages/Components/Badges'))
// );
// const Tooltips = Loader(
//   lazy(() => import('src/content/pages/Components/Tooltips'))
// );
// const Avatars = Loader(
//   lazy(() => import('src/content/pages/Components/Avatars'))
// );
// const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
// const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

// Status
const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);

const routes = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/',
        element: <Navigate to="order" replace />
      },
      {
        path: 'order',
        element: <SidebarLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="list" replace />
          },
          {
            path: 'list',
            element: <Order />
          },
          {
            path: 'add',
            element: <CreateOrder />
          },
          {
            path: 'view-details/:id',
            element: <ViewDetails />
          }
        ]
      },
      {
        path: 'transaction',
        element: <SidebarLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="list" replace />
          },
          {
            path: 'list',
            element: <Transactions />
          },
          {
            path: 'add-payment/:id',
            element: <AddPayment />
          }
        ]
      },
      {
        path: 'loan',
        element: <SidebarLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="list" replace />
          },
          {
            path: 'list',
            element: <Loans />
          },
          {
            path: 'add',
            element: <CreateLoan />
          },
          {
            path: 'add-payment/:id',
            element: <AddLoanAmount />
          }
        ]
      },
      {
        path: 'emi',
        element: <SidebarLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="list" replace />
          },
          {
            path: 'list',
            element: <EMIs />
          },
          {
            path: 'add',
            element: <CreateEMI />
          },
          {
            path: 'view-details/:id',
            element: <EmiViewDetails />
          }
        ]
      },
      {
        path: 'report',
        element: <SidebarLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="order-report" replace />
          },
          {
            path: 'order-report',
            element: <OrderReport />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  }
  // {
  //   path: 'dashboards',
  //   element: <SidebarLayout />,
  //   children: [
  //     {
  //       path: '',
  //       element: <Navigate to="tasks" replace />
  //     },
  //     {
  //       path: 'tasks',
  //       element: <Tasks />
  //     },
  //     {
  //       path: 'messenger',
  //       element: <Messenger />
  //     }
  //   ]
  // },
  // {
  //   path: 'management',
  //   element: <SidebarLayout />,
  //   children: [
  //     {
  //       path: '',
  //       element: <Navigate to="transactions" replace />
  //     },
  //     {
  //       path: 'transactions',
  //       element: <Transactions />
  //     },
  //     {
  //       path: 'profile',
  //       children: [
  //         {
  //           path: '',
  //           element: <Navigate to="details" replace />
  //         },
  //         {
  //           path: 'details',
  //           element: <UserProfile />
  //         },
  //         {
  //           path: 'settings',
  //           element: <UserSettings />
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   path: '/components',
  //   element: <SidebarLayout />,
  //   children: [
  //     {
  //       path: '',
  //       element: <Navigate to="buttons" replace />
  //     },
  //     {
  //       path: 'buttons',
  //       element: <Buttons />
  //     },
  //     {
  //       path: 'modals',
  //       element: <Modals />
  //     },
  //     {
  //       path: 'accordions',
  //       element: <Accordions />
  //     },
  //     {
  //       path: 'tabs',
  //       element: <Tabs />
  //     },
  //     {
  //       path: 'badges',
  //       element: <Badges />
  //     },
  //     {
  //       path: 'tooltips',
  //       element: <Tooltips />
  //     },
  //     {
  //       path: 'avatars',
  //       element: <Avatars />
  //     },
  //     {
  //       path: 'cards',
  //       element: <Cards />
  //     },
  //     {
  //       path: 'forms',
  //       element: <Forms />
  //     }
  //   ]
  // }
];

export default routes;
