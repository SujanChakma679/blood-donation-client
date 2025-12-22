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
        element: <Payment />,
      },
    ],
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "dashboard/my-donation-requests",
        Component: MyRequest,
      },
      {
        path: "dashboard/create-donation-request",
        Component: CreateRequest,
      },
      {
        path: "dashboard/all-users",
        Component: AllUsers,
      },
      {
        path: "dashboard/all-blood-donation-request",
        Component: AllBloodDonationRequests,
      },
      {
        path: "/dashboard/request/:id",
        element: <DonationRequestDetails />,
      },
    ],
  },
]);
