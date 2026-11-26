import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import Root from "../Layout/Root";
import EventPlanner from "../pages/ClubPages/EventPlanner/EventPlanner";
import Chat from "../pages/Dashboard/Club/Chat";
import ClubAnalytics from "../pages/Dashboard/Club/ClubAnalytics";
import ClubDetails from "../pages/Dashboard/Club/ClubDetails";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import Approval from "../pages/Dashboard/OCA/Approval";
import ChatWithClub from "../pages/Dashboard/OCA/ChatWithClub";
import ClubInfo from "../pages/Dashboard/OCA/ClubInfo";
import OCAChat from "../pages/Dashboard/OCA/OCAChat";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Calendar from "../pages/Shared/Calendar";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <p className="p-8 text-center text-red-600">Something went wrong loading this page.</p>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardHome />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/event-planner",
        element: (
          <PrivateRoute>
            <EventPlanner />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/chat",
        element: (
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/club-analytics",
        element: (
          <PrivateRoute>
            <ClubAnalytics />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/approval",
        element: (
          <PrivateRoute>
            <Approval />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/club-info",
        element: (
          <PrivateRoute>
            <ClubInfo />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/club-info/:id",
        element: (
          <PrivateRoute>
            <ClubDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/oca-chat",
        element: (
          <PrivateRoute>
            <OCAChat />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/dashboard/oca-chat",
            element: <ChatWithClub />,
          },
          {
            path: "/dashboard/oca-chat/:email",
            element: <ChatWithClub />,
          },
        ],
      },
      {
        path: "/dashboard/calendar",
        element: (
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
