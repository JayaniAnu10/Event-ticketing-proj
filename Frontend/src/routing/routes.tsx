import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Layout from "@/components/Layout";
import AuthLayout from "@/components/AuthLayout";
import HomePage from "@/pages/HomePage";
import Events from "@/pages/Events";
import ViewDetails from "@/pages/ViewDetails";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import BookingSuccessPage from "@/pages/BookingSuccessPage";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminEvents from "@/pages/Admin/AdminEvents";
import AdminManageUsers from "@/pages/Admin/AdminManageUsers";
import AdminAddEvent from "@/pages/Admin/AdminAddEvent";
import AdminEditEvent from "@/pages/Admin/AdminEditEvent";
import EditProfile from "@/pages/EditProfile";
import ChangePassword from "@/pages/ChangePassword";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "events", element: <Events /> },
      {
        path: "events/:id",
        element: (
          <PrivateRoutes>
            <ViewDetails />
          </PrivateRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>
        ),
      },
      {
        path: "edit/:id",
        element: (
          <PrivateRoutes>
            <EditProfile />
          </PrivateRoutes>
        ),
      },
      {
        path: "/profile/:userId/change-password",
        element: (
          <PrivateRoutes>
            <ChangePassword />
          </PrivateRoutes>
        ),
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      {
        path: "checkout-success",
        element: (
          <PrivateRoutes>
            <BookingSuccessPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <PrivateRoutes requiredRole="ADMIN">
            <AdminDashboard />
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/events",
        element: (
          <PrivateRoutes requiredRole="ADMIN">
            <AdminEvents />
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/users",
        element: (
          <PrivateRoutes requiredRole="ADMIN">
            <AdminManageUsers />
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/add-event",
        element: (
          <PrivateRoutes requiredRole="ADMIN">
            <AdminAddEvent />
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/edit-event/:id",
        element: (
          <PrivateRoutes requiredRole="ADMIN">
            <AdminEditEvent />
          </PrivateRoutes>
        ),
      },
    ],
  },
]);

export default router;
