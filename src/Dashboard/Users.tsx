import { useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2, Loader2, Users as UsersIcon } from "lucide-react";
import { listUsers, fetchAllUsers, type UserListItem, deleteUser } from "../Service/api/users";

function roleColor(role: string) {
  if (role === "مسؤول") return "bg-red-500 text-white";
  if (role === "صاحب_مخيم") return "bg-green-600 text-white";
  return "bg-gray-700 text-white"; // مستخدم/زبون
}

function statusColor(isActive: boolean) {
  return isActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-900";
}

export default function UsersTable() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1); // 1-based
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await listUsers({ pageIndex: currentPage, pageSize: rowsPerPage });
        setUsers(data.data ?? []);
        setTotalCount(data.count ?? 0);
      } catch {
        setError("تعذر جلب المستخدمين");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage, rowsPerPage]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleDelete = async (user: UserListItem) => {
    debugger
    setOpenMenu(null);
    try {
      await deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setTotalCount(prev => Math.max(0, prev - 1));
      // يمكنك إضافة toast نجاح هنا
    } catch {
      // يمكنك إضافة toast فشل هنا
    }
  };

  return (
    <div className="w-full px-6 py-9" dir="rtl">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-[#2be178]" />
            المستخدمين
          </h1>
          <p className="mb-2 text-gray-400">إدارة المستخدمين والصلاحيات</p>
        </div>
        <div className="flex items-center gap-2">
          {/* زر تحميل الكل إن رغبت تفعيله لاحقًا */}
          {/* <button
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);
                const all = await fetchAllUsers();
                setUsers(all);
                setTotalCount(all.length);
                setCurrentPage(1);
                setRowsPerPage(all.length || 10);
              } catch {
                setError("تعذر تحميل كل المستخدمين");
              } finally {
                setLoading(false);
              }
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2be178] text-[#101415] hover:bg-[#25bc62] cursor-pointer"
            title="تحميل كل المستخدمين"
          >
            <Download className="w-4 h-4" />
            تحميل الكل
          </button> */}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-[#19191e] bg-opacity-95">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            جاري تحميل المستخدمين...
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-6">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400 py-6">لا توجد بيانات</p>
        ) : (
          <div className="w-full">
            {/* بطاقات الموبايل */}
            <div className="block md:hidden p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.map((user, idx) => (
                  <div key={user.id} className="rounded-lg border border-[#23232b] bg-[#1B1D23] p-4 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{user.displayName}</div>
                        <div className="text-xs text-gray-400 truncate mt-1">{user.email}</div>
                        <div className="text-xs text-gray-400 truncate">{user.phoneNumber}</div>
                      </div>

                      {/* <div ref={menuRef} className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                          className="p-1 hover:bg-[#23232b] rounded cursor-pointer"
                          aria-label="إجراءات"
                          title="إجراءات"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-300" />
                        </button>

                        {openMenu === idx && (
                          <div className="absolute left-0 top-8 z-50 min-w-[140px] rounded-lg bg-[#23232b] py-2 shadow-lg border border-[#222] flex flex-col">
                            <button
                              onClick={() => handleDelete(user)}
                              className="flex items-center justify-end gap-2 px-4 py-2 text-right hover:bg-red-500 hover:text-white cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </button>
                          </div>
                        )}
                      </div> */}
                    </div>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleColor(user.role)}`}>{user.role === 'زبون' ? 'عميل' : user.role}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor(user.isActive)}`}>
                        {user.isActive ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* جدول سطح المكتب */}
            <div className="hidden md:block">
              <table className="w-full rounded-lg text-right text-base">
                <thead>
                  <tr className="text-gray-400 text-md border-b border-[#23232b]">
                    <th className="py-4 px-3">الاسم</th>
                    <th className="py-4 px-3">البريد الإلكتروني</th>
                    <th className="py-4 px-3">رقم الهاتف</th>
                    <th className="py-4 px-3">النوع</th>
                    <th className="py-4 px-3">الحالة</th>
                    {/* <th className="py-4 px-3">إجراءات</th> */}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} className="border-b border-[#23232b] text-white relative">
                      <td className="py-3 px-3">{user.displayName}</td>
                      <td className="py-3 px-3">{user.email}</td>
                      <td className="py-3 px-3">{user.phoneNumber}</td>
                      <td className="py-3 px-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${roleColor(user.role)}`}>{user.role}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColor(user.isActive)}`}>
                          {user.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      {/* <td className="py-3 px-3 text-center relative">
                        <div ref={menuRef} className="relative inline-block">
                          <span
                            onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                            className="cursor-pointer"
                            title="إجراءات"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-300" />
                          </span>
                          {openMenu === idx && (
                            <div className="absolute left-0 top-10 z-50 min-w-[140px] rounded-lg bg-[#23232b] py-2 shadow-lg border border-[#222] flex flex-col">
                              <button
                                onClick={() => handleDelete(user)}
                                className="flex items-center justify-end gap-2 px-4 py-2 hover:bg-red-500 hover:text-white text-right cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                                حذف
                              </button>
                            </div>
                          )}
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ترقيم الصفحات */}
      {!loading && users.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">عدد الصفوف:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(e.target.value)}
              className="h-9 rounded-md border border-[#23232b] bg-[#19191e] px-3 py-1 text-sm text-white cursor-pointer"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              صفحة {currentPage} من {totalPages} ({totalCount} مستخدم)
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded-md border border-[#23232b] text-sm text-white disabled:opacity-50 cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || totalCount === 0}
              >
                السابق
              </button>
              <button
                className="px-3 py-1 rounded-md border border-[#23232b] text-sm text-white disabled:opacity-50 cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalCount === 0}
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
