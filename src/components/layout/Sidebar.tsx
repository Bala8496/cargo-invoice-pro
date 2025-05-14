
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Users, Truck, Building, Settings } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
      active
        ? "bg-invoice-lightBlue text-invoice-blue font-medium"
        : "text-gray-700 hover:bg-gray-100"
    )}
  >
    <div className="text-inherit">{icon}</div>
    <span>{label}</span>
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="w-64 border-r border-gray-200 h-[calc(100vh-64px)] flex-shrink-0">
      <div className="p-4">
        <nav className="space-y-1">
          <NavItem
            to="/invoices"
            icon={<FileText size={20} />}
            label="Invoices"
            active={pathname.includes("/invoices")}
          />
          <NavItem
            to="/customers"
            icon={<Users size={20} />}
            label="Customers"
            active={pathname.includes("/customers")}
          />
          <NavItem
            to="/vehicles"
            icon={<Truck size={20} />}
            label="Vehicles"
            active={pathname.includes("/vehicles")}
          />
          <NavItem
            to="/transport-companies"
            icon={<Building size={20} />}
            label="Transport Companies"
            active={pathname.includes("/transport-companies")}
          />
          <NavItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            active={pathname.includes("/settings")}
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
