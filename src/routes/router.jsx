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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
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
        Component: AllUsers
      },
       {
        path: "dashboard/all-blood-donation-request",
        Component: AllBloodDonationRequests
      },
    ],
  },
]);
