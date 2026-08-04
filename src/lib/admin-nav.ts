export type AdminNavItem = {
  name: string;
  path: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { name: "Reviews", path: "/secret/admin" },
  { name: "Web Profile", path: "/secret/admin/profile" },
];

export function isAdminActivePath(pathname: string, path: string) {
  if (path === "/secret/admin") {
    return pathname === "/secret/admin" || pathname === "/secret/admin/";
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function adminRouteLabel(pathname: string) {
  const match = ADMIN_NAV_ITEMS.find((item) =>
    isAdminActivePath(pathname, item.path),
  );
  return match?.name ?? "Admin";
}
