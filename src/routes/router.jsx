import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import MyRequest from "../pages/Dashboard/MyRequest";
import CreateRequest from "../pages/Dashboard/CreateRequest";
import AllUsers from "../pages/Dashboard/AllUsers";
import AllBloodDonationRequests from "../pages/Dashboard/AllBloodDonationRequests";
import DonationRequestDetails from "../pages/Dashboard/RequestDetails";
import DonationDetails from "../components/DonationRequestDetails/DonationRequestDetails";
import DonationRequests from "../components/DonationRequests/DonationRequests";
import SearchDonors from "../components/SearchDonors/SearchDonors";
import Donation from "../components/Donation/Donation";
import PaymentSuccess from "../components/PaymentSuccess/PaymentSuccess";
import PaymentRoute from "./PaymentRoute";
import Payment from "../components/Payment/Payment";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import NotFound from "../pages/NotFound/NotFound";
import PrivateRoute from "./PrivateRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "donation-requests/:id",
        element: <DonationDetails />,
      },
      {
        path: "search-donors",
        element: <SearchDonors />,
      },
      {
        path: "donation",
        element: <Donation />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "financial-donations",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    // element: <PrivateRoute />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "my-donation-requests",
            element: <MyRequest />,
          },
          {
            path: "create-donation-request",
            element: <CreateRequest />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-blood-donation-request",
            element: <AllBloodDonationRequests />,
          },
          {
            path: "request/:id",
            element: <DonationRequestDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
