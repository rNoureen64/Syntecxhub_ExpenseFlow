import { useEffect, useMemo, useState } from "react";

function NotificationCenter({
  notifications = [],
  readNotifications = [],
  markNotificationAsRead = () => {},
  markAllNotificationsAsRead = () => {}
}) {
  const [filter, setFilter] = useState("all");

  const safeNotifications = useMemo(() => {
    return Array.isArray(notifications)
      ? notifications
      : [];
  }, [notifications]);

  const safeReadNotifications = useMemo(() => {
    return Array.isArray(readNotifications)
      ? readNotifications
      : [];
  }, [readNotifications]);

  const unreadNotifications = useMemo(() => {
    return safeNotifications.filter(
      (notification) =>
        !safeReadNotifications.includes(
          notification.id
        )
    );
  }, [
    safeNotifications,
    safeReadNotifications
  ]);

  useEffect(() => {
    if (
      filter === "unread" &&
      unreadNotifications.length === 0
    ) {
      setFilter("all");
    }
  }, [
    filter,
    unreadNotifications.length
  ]);

  const displayedNotifications =
    filter === "unread"
      ? unreadNotifications
      : safeNotifications;

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case "danger":
        return "notification-danger";

      case "warning":
        return "notification-warning";

      case "success":
        return "notification-success";

      default:
        return "notification-info";
    }
  };

  return (
    <section className="notification-center">

      <div className="notification-header">

        <div>
          <span className="notification-eyebrow">
            SMART ALERTS
          </span>

          <h2>
            Notifications
          </h2>

          <p>
            Stay updated with your financial activity
            and important alerts.
          </p>
        </div>

        <div className="notification-actions">

          <button
            className={`notification-filter ${
              filter === "all"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </button>

          <button
            className={`notification-filter ${
              filter === "unread"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter("unread")
            }
          >
            Unread

            {unreadNotifications.length >
              0 && (
              <span className="notification-filter-count">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {unreadNotifications.length >
            0 && (
            <button
              className="mark-all-read-button"
              onClick={
                handleMarkAllRead
              }
            >
              Mark all as read
            </button>
          )}

        </div>
      </div>

      <div className="notification-summary">

        <div className="notification-summary-icon">
          🔔
        </div>

        <div>
          <strong>
            {unreadNotifications.length} unread
          </strong>

          <span>
            {unreadNotifications.length ===
            1
              ? "notification needs your attention"
              : "notifications need your attention"}
          </span>
        </div>

      </div>

      <div className="notification-list">

        {displayedNotifications.length ===
        0 ? (

          <div className="notification-empty">

            <div className="notification-empty-icon">
              ✓
            </div>

            <h3>
              You're all caught up
            </h3>

            <p>
              There are no unread
              notifications right now.
            </p>

          </div>

        ) : (

          displayedNotifications.map(
            (notification) => {

              const isRead =
                safeReadNotifications.includes(
                  notification.id
                );

              return (
                <div
                  key={
                    notification.id
                  }
                  className={`notification-item ${
                    isRead
                      ? "read"
                      : "unread"
                  }`}
                >

                  <div
                    className={`notification-icon ${getNotificationClass(
                      notification.type
                    )}`}
                  >
                    {notification.icon ||
                      "•"}
                  </div>

                  <div className="notification-content">

                    <div className="notification-item-top">

                      <h3>
                        {notification.title}
                      </h3>

                      {!isRead && (
                        <span className="notification-unread-dot"></span>
                      )}

                    </div>

                    <p>
                      {notification.message}
                    </p>

                    <span className="notification-time">
                      {notification.time ||
                        ""}
                    </span>

                  </div>

                  {!isRead && (
                    <button
                      type="button"
                      className="notification-read-button"
                      onClick={() =>
                        markNotificationAsRead(
                          notification.id
                        )
                      }
                      aria-label={`Mark ${notification.title} as read`}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}

                </div>
              );
            }
          )
        )}

      </div>

    </section>
  );
}

export default NotificationCenter;