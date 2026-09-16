import { useState } from "react";

function Sidebar({
  activeSection,
  setActiveSection,
  notificationCount = 0
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂"
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "≡"
    },
    {
      id: "recurring",
      label: "Recurring",
      icon: "↻"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "🔔",
      badge: notificationCount
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "↗"
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙"
    }
  ];

  const handleNavigation = (section) => {
    setActiveSection(section);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() =>
          setMobileOpen(
            (previous) => !previous
          )
        }
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {mobileOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen
            ? "mobile-sidebar-open"
            : ""
        }`}
      >

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            EF
          </div>

          <div>
            <h2>
              ExpenseFlow
            </h2>

            <span>
              Finance Manager
            </span>
          </div>

          <button
            className="mobile-sidebar-close"
            onClick={() =>
              setMobileOpen(false)
            }
            aria-label="Close navigation menu"
          >
            ×
          </button>

        </div>

        <nav className="sidebar-nav">

          <span className="sidebar-section-title">
            MENU
          </span>

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${
                activeSection === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation(item.id)
              }
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span className="sidebar-link-label">
                {item.label}
              </span>

              {item.badge > 0 && (
                <span className="notification-badge">
                  {item.badge > 99
                    ? "99+"
                    : item.badge}
                </span>
              )}

            </button>
          ))}

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-help">

            <div className="sidebar-help-icon">
              ?
            </div>

            <div>
              <strong>
                Need help?
              </strong>

              <p>
                Manage your finances with ease.
              </p>
            </div>

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;