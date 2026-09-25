"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Settings2,
  GraduationCap,
  ImagePlus,
  PackagePlus,
  UsersRound,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Tooltip from "@/components/ui/Tooltip";

const menus = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Events", path: "/admin/events", icon: CalendarDays },
  { name: "Manage Event", path: "/admin/events/manage", icon: Settings2 },
  { name: "Graduates", path: "/admin/graduates", icon: GraduationCap },
  { name: "Upload Photo", path: "/admin/photos", icon: ImagePlus },
  { name: "Bulk Upload", path: "/admin/photos/bulk", icon: PackagePlus },
  { name: "Users", path: "/admin/users", icon: UsersRound },
];

const STORAGE_KEY = "admin-sidebar-collapsed";

// Only the most specific menu entry should be active.
// "/admin" matches every admin route, and "/admin/events" is a
// prefix of "/admin/events/manage" — longest match wins.
function matchActivePath(pathname: string) {
  // Normalise a trailing slash so "/admin/" matches "/admin".
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  let best = "";

  for (const item of menus) {
    const match =
      item.path === "/admin"
        ? path === "/admin"
        : path === item.path || path.startsWith(item.path + "/");

    if (match && item.path.length > best.length) {
      best = item.path;
    }
  }

  return best;
}

export default function AdminSidebar({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  // Read persisted state after mount to avoid an SSR/client hydration mismatch.
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    }
  }, [collapsed, ready]);

  const activePath = matchActivePath(pathname);

  return (
    <aside
      className={cn(
        // Mobile: horizontal bar
        "flex shrink-0 flex-row items-center gap-3 overflow-x-auto border-b border-line-soft bg-app px-5 py-4",
        // Desktop: vertical rail, width depends on collapsed state
        "min-[900px]:sticky min-[900px]:top-0 min-[900px]:h-screen min-[900px]:flex-col min-[900px]:items-stretch min-[900px]:gap-0 min-[900px]:overflow-x-visible min-[900px]:border-b-0 min-[900px]:border-r min-[900px]:py-6 min-[900px]:overflow-y-auto",
        "transition-[width] duration-200",
        collapsed
          ? "min-[900px]:w-[76px] min-[900px]:px-3"
          : "min-[900px]:w-[230px] min-[900px]:px-5",
      )}
    >
      {/* BRAND + COLLAPSE TOGGLE */}
      <div
        className={cn(
          "mr-2 shrink-0 min-[900px]:mr-0 min-[900px]:mb-8",
          "min-[900px]:flex min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-2 ",
        )}
      >
        <div className="min-w-0">
          <h1
            className={cn(
              "text-[18px] font-extrabold tracking-tight text-hi",
              collapsed && "min-[900px]:hidden",
            )}
          >
            PANDAWA<span className="text-brand">HUB</span>
          </h1>

          {collapsed && (
            <Tooltip label="Expand sidebar">
              <Image
                onClick={() => setCollapsed((v) => !v)}
                src="/Pandawa_Logo_Short_W.png"
                alt="Expand sidebar"
                width={220}
                height={80}
                className="h-12 w-auto object-contain cursor-pointer"
                priority
              />
            </Tooltip>
          )}

          {!collapsed && (
            <p className="hidden text-xs text-low min-[900px]:block">
              Graduation Management
            </p>
          )}
        </div>

        {!collapsed && (
          <Tooltip label="Collapse sidebar">
            <button
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Collapse sidebar"
              className="hidden rounded-[13px] p-2 text-low transition hover:bg-white/5 hover:text-hi min-[900px]:block"
            >
              <PanelLeftClose size={18} />
            </button>
          </Tooltip>
        )}
      </div>

      {/* NAV */}
      <nav className="flex flex-row gap-1 min-[900px]:flex-col">
        {menus.map((item) => {
          const Icon = item.icon;
          const active = item.path === activePath;

          return (
            <Tooltip
              key={item.path}
              label={item.name}
              disabled={!collapsed}
              className="min-[900px]:w-full"
            >
              <Link
                href={item.path}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.name : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-[13px] py-2.5 text-[14.5px] font-semibold transition",
                  "px-3 max-[899px]:w-full min-[900px]:w-full min-[900px]:px-3.5",
                  collapsed && "min-[900px]:justify-center min-[900px]:px-0",
                  active
                    ? "bg-brand text-white"
                    : "text-mid hover:bg-white/5 hover:text-hi",
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span
                  className={collapsed ? "hidden" : "hidden min-[900px]:inline"}
                >
                  {item.name}
                </span>
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      {/* FOOTER (desktop) */}
      <div
        className={cn(
          "mt-auto hidden flex-col gap-1 pt-6 min-[900px]:flex",
          collapsed && "min-[900px]:items-center",
        )}
      >
        <Tooltip label="Logout" disabled={!collapsed}>
          <button
            onClick={onLogout}
            aria-label="Logout"
            className={cn(
              "flex items-center gap-3 rounded-[13px] px-3.5 py-2.5 text-[14.5px] font-semibold text-mid transition hover:bg-white/5 hover:text-danger",
              collapsed && "min-[900px]:justify-center min-[900px]:px-0",
            )}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={cn(collapsed && "min-[900px]:hidden")}>
              Logout
            </span>
          </button>
        </Tooltip>

        <div
          className={cn(
            "mt-3.5 flex items-center gap-2.5 border-t border-line-soft pt-5",
            collapsed && "min-[900px]:justify-center",
          )}
        >
          <Tooltip label={username} disabled={!collapsed}>
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
          </Tooltip>
          <span
            className={cn(
              "truncate text-sm font-semibold text-hi",
              collapsed && "min-[900px]:hidden",
            )}
          >
            {username}
          </span>
        </div>
      </div>

      {/* LOGOUT (mobile) */}
      <button
        onClick={onLogout}
        aria-label="Logout"
        className="ml-auto flex shrink-0 items-center justify-center rounded-[13px] p-2.5 text-mid transition hover:bg-white/5 hover:text-danger min-[900px]:hidden"
      >
        <LogOut size={18} />
      </button>
    </aside>
  );
}
