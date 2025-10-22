import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Tent,
  Calendar,
  Users,
  MapPin,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Plane,
  BadgeDollarSign,
  ClipboardList
} from "lucide-react";
import { getRoleFromToken } from "../lib/auth";

type MenuItem = {
  icon: any;
  label: string;
  path: string;
  allow: string[]; // الأدوار المسموح بها
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // تحديد الدور الحالي
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  const role = getRoleFromToken(token) || localStorage.getItem("role") || "مستخدم";

  const allItems: MenuItem[] = useMemo(() => ([
    { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard", allow: ["صاحب_مخيم", "مسؤول", "مستخدم"] },

    // مسؤول فقط
    { icon: Tent, label: "المخيمات", path: "/dashboard/camps", allow: ["مسؤول"] },
    { icon: Users, label: "المستخدمين", path: "/dashboard/users", allow: ["مسؤول"] },
    { icon: BadgeDollarSign, label: "الخطط", path: "/dashboard/plans", allow: ["مسؤول"] },
    { icon: ClipboardList, label: "طلبات الانضمام", path: "/dashboard/joinrequests", allow: ["مسؤول"] },

    // صاحب مخيم فقط
    { icon: Tent, label: "مخيماتي", path: "/dashboard/mycamps", allow: ["صاحب_مخيم"] },

    // متاح للدورين
    { icon: Calendar, label: "الحجوزات", path: "/dashboard/bookings", allow: ["صاحب_مخيم"] },
    { icon: Calendar, label: "تقييم العملاء", path: "/dashboard/ownerReviews", allow: ["صاحب_مخيم"] },
    { icon: Calendar, label: "إداره المخيمات", path: "/dashboard/adminCustomers", allow: ["مسؤول"] },

    // متاح للمسؤول فقط (إن رغبت)
    // { icon: MapPin, label: "المواقع", path: "/dashboard/locations", allow: ["مسؤول"] },

    // إشعارات: مثال متاح لكلا الدورين
    // { icon: Bell, label: "الإشعارات", path: "/dashboard/notifications", allow: ["صاحب_مخيم", "مسؤول"] },
  ]), []);

  // تصفية العناصر حسب الدور
  const menuItems = useMemo(() => allItems.filter(i => i.allow.includes(role)), [allItems, role]);

  function SidebarContent() {
    return (
      <>
        {/* اللوجو والرأس */}
        <div className="p-6 border-b border-[#23232b] flex items-center justify-between">
          {!collapsed && (
            <span className="text-3xl font-bold text-[#27cd88]">Camply</span>
          )}
          <button
            className="hidden md:inline-flex bg-transparent p-1 rounded-full"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight className={`h-5 w-5 text-white transition-transform ${collapsed ? "rotate-0" : "rotate-180"}`} />
          </button>
          <button
            className="md:hidden bg-transparent p-1 rounded-full"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* عناصر الناف */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                hover:bg-[#23232b]
                ${isActive ? "bg-[#182c22] text-[#27cd88] font-bold" : "text-white"}
                ${collapsed ? "justify-center" : ""}
                `
              }
              aria-label={item.label}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* الخيارات السفلية */}
        <div className="p-4 border-t border-[#23232b] space-y-2">
          <NavLink
            to="/dashboard/settings"
            className={`flex items-center gap-3 py-2 text-gray-400 hover:text-[#27cd88] transition ${collapsed ? "justify-center" : "justify-start"}`}
            aria-label="الإعدادات"
            title={collapsed ? "الإعدادات" : undefined}
            onClick={() => setMobileOpen(false)}
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span>الإعدادات</span>}
          </NavLink>

          <button
            className={`flex items-center gap-3 py-2 text-red-500 hover:text-red-600 font-bold transition ${collapsed ? "justify-center" : "justify-start"}`}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("userId");
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("role");
              sessionStorage.removeItem("userId");
              navigate("/home");
            }}
            aria-label="تسجيل الخروج"
            title={collapsed ? "تسجيل الخروج" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* زر فتح القائمة في الموبايل */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 bg-[#19191e] p-2 rounded-full border border-[#23232b]"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* شاشة سوداء عند فتح القائمة في الموبايل */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar موبايل */}
      <aside
        className={`
          fixed top-0 right-0 h-full bg-[#16171d] border-l border-[#23232b] z-50 md:hidden
          transition-transform duration-300 w-64
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Sidebar ديسكتوب */}
      <aside
        className={`
          hidden md:flex flex-col h-screen bg-[#16171d] border-l border-[#23232b]
          transition-all duration-300 sticky top-0
          ${collapsed ? "w-20" : "w-64"}
        `}
        aria-label="Sidebar"
      >
        <SidebarContent />
      </aside>
    </>
  );
}
