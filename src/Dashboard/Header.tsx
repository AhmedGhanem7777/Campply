import { useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import strings from "../lib/strings.ar.json";
import { getUserById, type UserDto } from "../Service/api/users";

export default function Navbar() {
  const [me, setMe] = useState<UserDto | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId") || sessionStorage.getItem("userId") || "";
    if (!id) return;
    const ctrl = new AbortController();
    setLoadingUser(true);
    getUserById(id)
      .then(res => setMe(res.data))
      .catch(() => setMe(null))
      .finally(() => setLoadingUser(false));
    return () => ctrl.abort();
  }, []);

  const displayName = loadingUser
    ? "..."
    : me?.displayName || "المستخدم";

  const email = loadingUser
    ? "..."
    : me?.email || "—";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-[#121417]/95 backdrop-blur supports-[backdrop-filter]:bg-[#121417]/60" dir="rtl">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={strings.common.search}
              className="pr-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications (مثال معطّل) */}
          {/* ... */}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="الحساب">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>الملف الشخصي</DropdownMenuItem> */}
              {/* <DropdownMenuItem>{strings.sidebar.settings}</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  localStorage.removeItem("userId");
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("role");
                  sessionStorage.removeItem("userId");
                  window.location.href = "/home";
                }}
              >
                {strings.sidebar.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
