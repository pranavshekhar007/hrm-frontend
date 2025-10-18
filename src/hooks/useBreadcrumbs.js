// useBreadcrumbs.js
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

const NAV_STRUCTURE = [
  {
    menu: "Dashboard",
    subMenu: [{ name: "Dashboard", path: "/" }],
  },
  {
    menu: "Staff",
    subMenu: [
      {
        name: "Users",
        path: "/user-list",
      },
      {
        name: "Role",
        path: "/role-list",
      },
    ],
  },
  {
    menu: "Hr Management",
    subMenu: [
      {
        name: "Branches",
        path: "/branch-list",
      },
      {
        name: "Department",
        path: "/department-list",
      },
      { name: "Documents Type", path: "/document-type" },
      {
        name: "Designation",
        path: "/designation-list",
      },
      {
        name: "Employee",
        path: "/employee-list",
        childMenu: [
          { name: "Create Employee", path: "/create-employee" },
          { name: "Edit Employee", path: "/edit-employee" },
        ],
      },
      {
        name: "Award Types",
        path: "/award-type-list",
       
      },
      {
        name: "Awards",
        path: "/award-list",
      
      },
      {
        name: "Promotion",
        path: "/promotion-list",
        
      },
    ],
  },
];

const useBreadcrumbs = () => {
  const { pathname } = useLocation();

  const breadcrumbs = useMemo(() => {
    let currentMenu = null;
    let currentSubMenu = null;
    let currentChildMenu = null;

    // Step 1: Find matching menu/submenu/childMenu
    for (const group of NAV_STRUCTURE) {
      for (const sub of group.subMenu) {
        // Check for child menu match first (handles deeper routes)
        if (sub.childMenu) {
          for (const child of sub.childMenu) {
            const childBasePath = child.path.replace("/:id", "");
            if (pathname.startsWith(childBasePath)) {
              currentMenu = group.menu;
              currentSubMenu = sub;
              currentChildMenu = child;
              break;
            }
          }
        }
        if (currentChildMenu) break; // Stop once found
        // Otherwise, match regular submenu
        if (pathname === sub.path) {
          currentMenu = group.menu;
          currentSubMenu = sub;
          break;
        }
      }
      if (currentSubMenu || currentChildMenu) break;
    }

    // Step 2: Build breadcrumb array
    const crumbs = [{ name: "Dashboard", path: "/" }];

    if (currentMenu && currentMenu !== "Dashboard") {
      crumbs.push({ name: currentMenu, path: null });
    }

    if (currentSubMenu) {
      crumbs.push({ name: currentSubMenu.name, path: currentSubMenu.path });
    }

    if (currentChildMenu) {
      crumbs.push({ name: currentChildMenu.name, path: currentChildMenu.path });
    }

    return crumbs;
  }, [pathname]);

  return breadcrumbs;
};

export default useBreadcrumbs;
