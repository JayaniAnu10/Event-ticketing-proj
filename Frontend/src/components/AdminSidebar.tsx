import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Calendar,
  LayoutDashboard,
  Plus,
  Users,
  List,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: List, label: "Manage Events", path: "/admin/events" },
  { icon: Plus, label: "Add Event", path: "/admin/add-event" },
  { icon: Users, label: "Manage Users", path: "/admin/users" },
];

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
  const location = useLocation();

  return (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-linear-to-r from-primary to-violet-300 rounded-full">
            <Calendar className="w-5 h-5 text-primary-foreground dark:text-white" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">
            Admin Panel
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={onItemClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 transition-all text-sidebar-foreground dark:text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-violet-600 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link to="/" onClick={onItemClick}>
          <Button variant="outline" className="w-full">
            Back to Website
          </Button>
        </Link>
      </div>
    </>
  );
};

// Desktop Sidebar
export const AdminSidebar = () => {
  return (
    <aside className="hidden lg:flex w-64 bg-sidebar-background border-r border-sidebar-border h-screen sticky top-0 flex-col">
      <SidebarContent />
    </aside>
  );
};

// Mobile Header
export const AdminMobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-background/90 border-b border-sidebar-border">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-linear-to-r from-primary to-violet-300 rounded-full">
          <Calendar className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-sidebar-foreground">Admin Panel</span>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground"
          >
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-background border-sidebar-border"
        >
          <div className="flex flex-col h-full">
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
