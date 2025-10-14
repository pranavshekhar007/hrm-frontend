import { useLocation } from "react-router-dom";
import { useMemo } from "react";

// Define the navigation structure based on your Sidebar code
// This is crucial for mapping the current path to its menu/submenu name
const NAV_STRUCTURE = [
  {
    menu: "Dashboard",
    subMenu: [{ name: "Dashboard", path: "/" }],
  },
  {
    menu: "Staff",
    subMenu: [
      { name: "Users", path: "/user-list" },
      { name: "Role", path: "/role-list" },
    ],
  },
  // Add other menu items from your sidebar here, like:
  {
    menu: "Hr Management",
    subMenu: [
      { name: "Branches", path: "/branch-list" },
      { name: "Department", path: "/department-list" },
      { name: "Designations", path: "/departments-list" },
      { name: "Documents Type", path: "/departments-list" },
      { name: "Employee", path: "/departments-list" },
      { name: "Award Types", path: "/departments-list" },
      { name: "Awards", path: "/departments-list" },
      { name: "Promotion", path: "/departments-list" },
    ],
  },
];


const useBreadcrumbs = () => {
  const { pathname } = useLocation();

  const breadcrumbs = useMemo(() => {
    // 1. Find the current submenu item and its parent menu
    let currentMenu = null;
    let currentSubMenu = null;
    
    // Flatten the structure to find the item
    for (const group of NAV_STRUCTURE) {
      currentSubMenu = group.subMenu.find(sub => sub.path === pathname);
      if (currentSubMenu) {
        currentMenu = group.menu;
        break;
      }
    }

    // 2. Build the breadcrumb array
    const crumbs = [];

    // The first item is always 'Dashboard'
    crumbs.push({ name: "Dashboard", path: "/" });

    if (currentMenu) {
      // If the current menu is not 'Dashboard', add it as the second item
      if (currentMenu !== "Dashboard") {
        // We'll use a placeholder path for the main menu if it's not a direct route
        crumbs.push({ name: currentMenu, path: null }); 
      }

      // Add the final submenu item (the current page)
      if (currentSubMenu) {
        // Ensure we don't duplicate 'Dashboard' if the path is '/'
        if (currentSubMenu.path !== "/") {
          crumbs.push({ name: currentSubMenu.name, path: currentSubMenu.path });
        }
      }
    }
    
    return crumbs;
  }, [pathname]);

  return breadcrumbs;
};

export default useBreadcrumbs;