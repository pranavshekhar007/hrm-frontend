import React from "react";
import { useGlobalState } from "../GlobalProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

function TopNav() {
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalState();
  const breadcrumbs = useBreadcrumbs(); // Get the dynamic breadcrumbs

  // Function to handle sidebar toggle (from your first code)
  const handleSidebarToggle = () => {
    setGlobalState({
      ...globalState,
      showFullSidebar: !globalState.showFullSidebar,
    });
  };

  const handleLogoutFunc = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      setGlobalState({
        user: null,
        token: null,
        permissions: null,
      });
      toast.success("Admin logged out successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      navigate("/");
    }
  };

  return (
    // NOTE: Setting a background color here to distinguish the top nav, 
    // but you may want to apply a dedicated CSS class instead.
    <div className="topNavMain p-3 p-md-4"> 
      {/* Container for Hamburger, Breadcrumbs and Right-side Icons */}
      <div className="d-flex justify-content-between align-items-center">

        {/* LEFT SECTION: Hamburger Icon + Breadcrumbs */}
        <div className="d-flex align-items-center">
          
          {/* HAMBURGER ICON (Integrated from your first code) */}
          <img
            src="https://cdn-icons-png.flaticon.com/128/2976/2976215.png"
            onClick={handleSidebarToggle}
            className="barIcon" // Ensure you have CSS for this class (e.g., cursor: pointer)
            alt="Toggle Sidebar"
            style={{ height: "24px", width: "24px", cursor: "pointer", filter: "brightness(0) invert(1)" }}
          />

          {/* Dynamic Breadcrumbs Display (shifted slightly for better alignment) */}
          <div className="d-flex align-items-center breadcrumb-div ms-3">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <button
                  className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                  onClick={() => crumb.path && navigate(crumb.path)}
                  disabled={index === breadcrumbs.length - 1}
                >
                  {/* Use a fixed icon for 'Dashboard' as it's the root */}
                  {crumb.name === "Dashboard" && (
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1828/1828791.png"
                      className="breadcrumb-icon"
                      alt="Dashboard"
                    />
                  )}
                  <span className="breadcrumb-text">{crumb.name}</span>
                </button>
                {/* Separator: Show the '>' symbol between crumbs, but not after the last one */}
                {index < breadcrumbs.length - 1 && (
                  <span className="breadcrumb-separator">
                    &gt;
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION: Icons (Language, Company, User Profile) */}
        <div className="d-flex align-items-center navRightDiv">
          
          {/* Language Selector (English/GB) */}
          <div className="d-flex align-items-center me-3" style={{ cursor: "pointer" }}>
           <i class="fas fa-globe" style={{ marginRight: "10px", color: "white" }}></i>  
           <p className="mb-0 me-1" style={{ color: "white", marginRight: "10px" }}>English</p>
            <img 
              src="https://cdn-icons-png.flaticon.com/128/197/197374.png" 
              alt="UK Flag" 
              style={{ height: "14px", borderRadius: "2px"}} 
            />
          </div>

          {/* Company Icon */}
          <div className="d-flex align-items-center me-3" style={{ cursor: "pointer" }}>
            <p className="mb-0" style={{ color: "white" }}>Company</p>
          </div>
          
          {/* User Profile / Placeholder Icon */}
          <div 
            className="user-profile-icon"
            style={{ 
              height: "36px", 
              width: "36px", 
              borderRadius: "50%", 
              backgroundColor: "#E0E0E0", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => handleLogoutFunc()}
          >
             <img 
                src={globalState?.user?.profilePic || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"} 
                alt="User"
                style={{ 
                    height: "100%", 
                    width: "100%", 
                    borderRadius: "50%", 
                    objectFit: "cover" 
                }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default TopNav;