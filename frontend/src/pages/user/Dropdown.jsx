import {
  CircleUser,
  LogOut,
  LayoutDashboard,
  FileUser,
  Astroid,
} from "lucide-react/dist/cjs/lucide-react";

const Dropdown = () => {
  return (
    <div>
      <Astroid text="Upgrade Plan" />
      <LayoutDashboard text="Dashboard" />
      <FileUser text="Insights" />
      <CircleUser text="Profile" />
      <LogOut text="Logout" />
    </div>
  );
};

export default Dropdown;
