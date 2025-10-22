import React, { useState } from "react";
import { Trash2, CalendarDays, Mountain, CheckSquare2 } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  type: "reservation" | "camp" | "approved";
  unread: boolean;
};

const initialNotifications: Notification[] = [
  // {
  //   id: 1,
  //   title: "حجز جديد",
  //   subtitle: "تم استلام حجز جديد لمخيم الصحراء الذهبية",
  //   time: "منذ 5 دقائق",
  //   type: "reservation",
  //   unread: true,
  // },
  // {
  //   id: 2,
  //   title: "مخيم جديد",
  //   subtitle: "تم إضافة مخيم جديد بانتظار الموافقة",
  //   time: "منذ ساعة",
  //   type: "camp",
  //   unread: true,
  // },
  // {
  //   id: 3,
  //   title: "تمت الموافقة على الحجز",
  //   subtitle: "تمت الموافقة على حجز رقم B002",
  //   time: "منذ ساعتين",
  //   type: "approved",
  //   unread: false,
  // }
];

export default function NotificationsPage() {
  // const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
  // const removeNotification = (id: number) =>
  //   setNotifications(notifications.filter(n => n.id !== id));

  // // أيقونة ديناميكية حسب نوع الإشعار
  // function getIcon(type: Notification["type"]) {
  //   if (type === "reservation") return <CalendarDays className="w-10 h-10 text-white bg-[#e84848] rounded-xl p-2" />;
  //   if (type === "camp") return <Mountain className="w-10 h-10 text-white bg-[#ffb700] rounded-xl p-2" />;
  //   if (type === "approved") return <CheckSquare2 className="w-10 h-10 text-white bg-[#28cd60] rounded-xl p-2" />;
  //   return <CalendarDays className="w-10 h-10" />;
  // }

  // return (
  //   <div className="w-full px-6 py-9">
  //     <div className="flex items-center gap-2 mb-7">
  //       <h1 className="text-3xl font-bold text-white">الإشعارات</h1>
  //       <span className="bg-[#e84848] text-white text-xs px-3 py-1 rounded font-bold">2 جديد</span>
  //     </div>
  //     <p className="mb-5 text-gray-400">
  //       تابع جميع الإشعارات والتنبيهات الهامة
  //     </p>
  //     <div className="mb-3">
  //       <button
  //         className="bg-[#21212a] text-white px-4 py-2 rounded-lg text-sm font-bold"
  //         onClick={markAllRead}
  //       >
  //         تحديد الكل كمقروء <span className="ml-1">&#10003;</span>
  //       </button>
  //     </div>
  //     <div className="flex flex-col gap-4">
  //       {notifications.map(n => (
  //         <div
  //           key={n.id}
  //           className={`flex items-center rounded-xl px-5 py-7 relative
  //             ${n.unread ? "bg-[#13211a]" : "bg-[#23232b]"}`}
  //         >
  //           <button
  //             className="text-red-500 mr-2"
  //             onClick={() => removeNotification(n.id)}
  //             title="حذف"
  //           >
  //             <Trash2 className="w-6 h-6" />
  //           </button>
  //           {n.unread ? (
  //             <span className="bg-red-500 text-white font-bold text-sm px-4 py-1 rounded-full mr-2">
  //               جديد
  //             </span>
  //           ) : (
  //             <span className="bg-green-600 text-white font-bold text-sm px-4 py-1 rounded-full mr-2">
  //               تم
  //             </span>
  //           )}
  //           <div className="flex flex-col flex-1 text-right ml-3">
  //             <span className="font-bold text-lg text-white">{n.title}</span>
  //             <span className="text-gray-300">{n.subtitle}</span>
  //             <span className="text-gray-500 text-xs">{n.time}</span>
  //           </div>
  //           <div className="mr-3">{getIcon(n.type)}</div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
}
