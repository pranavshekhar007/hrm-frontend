import React, { useMemo, useState } from "react";
import { useGlobalState } from "../GlobalProvider";
import { useLocation, useNavigate } from "react-router-dom";

const GREEN = "#16a34a";

function Sidebar({ selectedMenu, selectedItem }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { globalState, setGlobalState } = useGlobalState(); // include setter

  const [hoverExpand, setHoverExpand] = useState(false);
  const isExpanded = globalState?.showFullSidebar || hoverExpand;

  const navItem = useMemo(
    () => [
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/1828/1828791.png",
        menu: "Dashboard",
        subMenu: [{ name: "Dashboard", path: "/" }],
      },
      // {
      //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2435/2435245.png",
      //   menu: "Order Management",
      //   subMenu: [{ name: "Orders", path: "/order-list" }],
      // },
      // {
      //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2875/2875916.png",
      //   menu: "Product Management",
      //   subMenu: [
      //     { name: "Products", path: "/product-list" },
      //     { name: "Add Product", path: "/add-product" },
      //     { name: "Combo Packs", path: "/combo-product-list" },
      //     { name: "Add Combo Packs", path: "/add-combo-product" },
      //     { name: "Categories", path: "/category-list" },
      //     { name: "Brands", path: "/brand-list" },
      //     { name: "Tags", path: "/tag-list" },
      //   ],
      // },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
        menu: "Staff",
        subMenu: [
          { name: "Users", path: "/user-list" },
          { name: "Role", path: "/role-list" },
        ],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
        menu: "Hr Management",
        subMenu: [
          { name: "Branches", path: "/branch-list" },
          { name: "Department", path: "/department-list" },
          { name: "Designation", path: "/designation-list" },
          { name: "Documents Type", path: "/document-type" },
          { name: "Employee", path: "/employee-list" },
          // { name: "Award Types", path: "/departments-list" },
          // { name: "Awards", path: "/departments-list" },
          // { name: "Promotion", path: "/departments-list" },
        ],
      },
      // {
      //   menuIcon: "https://cdn-icons-png.flaticon.com/128/535/535188.png",
      //   menu: "Location Management",
      //   subMenu: [
      //     { name: "States", path: "/state-list" },
      //     { name: "City", path: "/city-list" },
      //     { name: "Bulk Upload", path: "/bulk-upload" },
      //   ],
      // },
      // {
      //   menuIcon: "https://cdn-icons-png.flaticon.com/128/1601/1601521.png",
      //   menu: "Banners",
      //   subMenu: [{ name: "Banners", path: "/banner-list" }],
      // },
      // {
      //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2435/2435245.png",
      //   menu: "Subscription",
      //   subMenu: [
      //     { name: "Scheme", path: "/scheme" },
      //     { name: "Chit User", path: "/subscription-user" },
      //   ],
      // },
      // {
      //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2840/2840215.png",
      //   menu: "System Support",
      //   subMenu: [
      //     { name: "FAQs", path: "/faq-user-list" },
      //     { name: "Contact Query", path: "/contact-query" },
      //   ],
      // },
      // {
      //   menuIcon: "https://cdn-icons-png.flaticon.com/128/2312/2312402.png",
      //   menu: "Policy",
      //   subMenu: [
      //     { name: "Cookie Policy", path: "/user-cookie-policy" },
      //     { name: "Privacy Policy", path: "/user-privacy-policy" },
      //     { name: "Shipping Policy", path: "/user-shipping-policy" },
      //     { name: "Terms & Condition", path: "/user-terms-condition" },
      //     { name: "Refund and Returns", path: "/user-refund-return" },
      //   ],
      // },
    ],
    []
  );

  const [openMenu, setOpenMenu] = useState(selectedMenu || "Dashboard");
  const isActivePath = (p) => pathname === p;

  return (
    <aside
      className={`hrm-sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => !globalState?.showFullSidebar && setHoverExpand(true)}
      onMouseLeave={() => setHoverExpand(false)}
    >
      {/* Close button for mobile view */}
      <div className="d-flex justify-content-end p-2 d-md-none">
        <img
          src="https://cdn-icons-png.flaticon.com/128/753/753345.png"
          alt="Close"
          style={{ height: "20px", cursor: "pointer" }}
          onClick={() =>
            setGlobalState({ ...globalState, showFullSidebar: false })
          }
        />
      </div>

      {/* Brand row: HRM when expanded, Logo when collapsed */}
      <div className="hrm-brand no-hamburger">
        {isExpanded ? (
          <div className="hrm-wordmark" aria-label="HRM">
            <span className="hrm-h">H</span>
            <span className="hrm-r">R</span>
            <span className="hrm-m">M</span>
          </div>
        ) : (
          <img className="hrm-logo-compact" src="/HRM.jpeg" alt="Logo" />
        )}
      </div>

      <nav className="hrm-nav">
        {navItem.map((group) => {
          const expandedGroup = openMenu === group.menu;
          const isGroupSelected =
            expandedGroup ||
            group.subMenu.some(
              (s) => s.name === selectedItem || isActivePath(s.path)
            );
          return (
            <div
              key={group.menu}
              className={`hrm-group ${isGroupSelected ? "group-active" : ""}`}
            >
              <button
                className={`hrm-group-btn ${expandedGroup ? "open" : ""}`}
                onClick={() => setOpenMenu(expandedGroup ? "" : group.menu)}
                title={!isExpanded ? group.menu : undefined}
              >
                <img src={group.menuIcon} className="hrm-icon" alt="" />
                {isExpanded && <span className="hrm-group-text">{group.menu}</span>}
                {isExpanded && (
                  <span className="chev">{expandedGroup ? "▾" : "▸"}</span>
                )}
              </button>

              <div className={`hrm-sub ${expandedGroup && isExpanded ? "show" : ""}`}>
                {group.subMenu.map((s) => {
                  const active = s.name === selectedItem || isActivePath(s.path);
                  return (
                    <button
                      key={s.name}
                      className={`hrm-sub-item ${active ? "active" : ""}`}
                      onClick={() => navigate(s.path)}
                      title={!isExpanded ? s.name : undefined}
                    >
                      <span className="dot" />
                      {isExpanded && <span className="label">{s.name}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
