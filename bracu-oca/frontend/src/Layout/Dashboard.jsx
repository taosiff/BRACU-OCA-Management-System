import { useContext } from "react";
import { BiCalendar, BiChat } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import { CgEventbrite, CgLogOut } from "react-icons/cg";
import { FaCalendar, FaHome } from "react-icons/fa";
import { MdAnalytics, MdChat, MdEvent } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import useCurrentUser from "../hooks/useCurrentUser";

const Dashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const email = user?.email || "";
  const role = user?.role || (email === "oca@bracu.ac.bd" ? "oca" : "club");
  const username = email ? email.split("@")[0] : "USER";
  const uppercaseUsername = username.toUpperCase();

  const [currUser] = useCurrentUser();

  const navItems = {
    oca: [
      { to: "/dashboard", icon: <FaHome className="text-2xl" />, label: "Dashboard" },
      { to: "/dashboard/approval", icon: <CgEventbrite className="text-2xl" />, label: "Approval" },
      { to: "/dashboard/calendar", icon: <BiCalendar className="text-2xl" />, label: "Calendar" },
      { to: "/dashboard/club-info", icon: <BsInfo className="text-2xl" />, label: "Club Info" },
      { to: "/dashboard/oca-chat", icon: <BiChat className="text-2xl" />, label: "Chat" },
    ],
    club: [
      { to: "/dashboard", icon: <FaHome className="text-xl" />, label: "Dashboard" },
      { to: "/dashboard/event-planner", icon: <MdEvent className="text-2xl" />, label: "Event Planner" },
      { to: "/dashboard/calendar", icon: <FaCalendar className="text-2xl" />, label: "Calendar" },
      { to: "/dashboard/club-analytics", icon: <MdAnalytics className="text-2xl" />, label: "Transactions" },
      { to: "/dashboard/chat", icon: <MdChat className="text-2xl" />, label: "Chat" },
      ...(currUser?._id
        ? [{ to: `/dashboard/club-info/${currUser._id}`, icon: <BsInfo className="text-2xl" />, label: "Club Info" }]
        : []),
    ],
    visitor: [
      { to: "/dashboard", icon: <FaHome className="text-xl" />, label: "Dashboard" },
      { to: "/dashboard/club-info", icon: <BsInfo className="text-2xl" />, label: "Clubs Directory" },
      { to: "/dashboard/calendar", icon: <FaCalendar className="text-2xl" />, label: "Event Calendar" },
    ],
  };

  const commonItems = [
    { to: "/", icon: <FaHome className="text-xl" />, label: "Home" },
    { to: "/login", icon: <CgLogOut className="text-xl" />, label: "Logout", action: logOut },
  ];

  const displayLabel =
    role === "oca" ? "OCA" : role === "visitor" ? (user?.name || "VISITOR") : uppercaseUsername;

  return (
    <div className="flex font-poppins bg-[#F4F6F8] min-h-screen" data-theme="messi">
      <div className="bg-gradient-to-b from-[#0E4D6B] via-[#1B4254] to-[#3A3F47] w-[250px] min-h-screen shrink-0 shadow-xl">
        <ul className="menu space-y-3 mt-2 p-4 text-base text-[#FEFFFA]/80 font-medium">
          <li className="flex flex-col items-center py-4 border-b border-[#FEFFFA]/10 mb-2">
            <img
              src={currUser?.photo_url || "/images/logos/oca.svg"}
              alt={displayLabel}
              className="w-12 h-12 rounded-xl object-cover mb-2 shadow-md"
            />
            <span className="text-lg font-bold text-[#FEFFFA] tracking-wide text-center">
              {displayLabel}
            </span>
            {role === "visitor" && (
              <span className="text-[11px] uppercase tracking-widest text-[#FEFFFA]/65 mt-0.5">
                Visitor
              </span>
            )}
          </li>

          {(navItems[role] || []).map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#FEFFFA] text-[#0E4D6B] font-semibold shadow-sm"
                      : "text-[#FEFFFA]/80 hover:bg-[#FEFFFA]/10 hover:text-[#FEFFFA]"
                  }`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}

          <div className="border-t border-[#FEFFFA]/15 my-4"></div>

          {commonItems.map((item, index) => (
            <li key={index} onClick={item.action || (() => {})}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#FEFFFA] text-[#0E4D6B] font-semibold"
                      : "text-[#FEFFFA]/80 hover:bg-[#FEFFFA]/10 hover:text-[#FEFFFA]"
                  }`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-8 bg-[#F4F6F8] w-full font-poppins">
        <div className="w-full min-h-screen bg-[#F4F6F8]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
