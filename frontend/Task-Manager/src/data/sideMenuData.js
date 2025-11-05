import { AiOutlineHome, AiOutlineUnorderedList, AiOutlineUser } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";

export const SIDE_MENU_DATA = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: MdDashboard },
    { label: "Tasks", path: "/admin/tasks", icon: AiOutlineUnorderedList },
    { label: "Users", path: "/admin/users", icon: AiOutlineUser },
    { label: "Logout", path: "logout", icon: AiOutlineHome },
  ],

  user: [
    { label: "Dashboard", path: "/dashboard", icon: MdDashboard },
    { label: "My Tasks", path: "/tasks", icon: AiOutlineUnorderedList },
    { label: "Logout", path: "logout", icon: AiOutlineHome },
  ],
};
