import { useEffect, useMemo, useState } from "react";

function NotificationCenter({
  transactions = [],
  budget = 0,
  recurringTransactions = [],
  readNotificationIds = [],
  markNotificationRead = () => {},
  markAllNotificationsRead = () => {},
  onUnreadCountChange = () => {}
}) {
  const [filter, setFilter] = useState("all");

  const notifications = useMemo(() => {
    const safeTransactions = Array.isArray(transactions)
      ? transactions
      : [];

    const safeRecurringTransactions = Array.isArray(recurringTransactions)
      ? recurringTransactions
      : [];

    const items = [];

    const totalIncome = safeTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    const totalExpenses = safeTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    const balance = totalIncome - totalExpenses;

    if (Number(budget) > 0 && totalExpenses > Number(budget)) {
      items.push({
        id: "budget-exceeded",
        type: "danger",
        icon: "⚠",
        title: "Budget exceeded",
        message: `Your expenses have exceeded your monthly budget of Rs.${Number(
          budget
        ).toLocaleString()}.`,
        time: "Budget alert"
      });
    }

    if (Number(budget) > 0 && totalExpenses >= Number(budget) * 0.8) {
      items.push({
        id: "budget-warning",
        type: "warning",
        icon: "◉",
        title: "Budget warning",
        message: `You have used ${Math.round(
          (totalExpenses / Number(budget)) * 100
        )}% of your monthly budget.`,
        time: "Budget alert"
      });
    }

    if (safeTransactions.length > 0) {
      const latestTransaction = [...safeTransactions].sort(
        (a, b) =>
          new Date(b.date || 0) -
          new Date(a.date || 0)
      )[0];

      if (latestTransaction) {
        const amount = Number(latestTransaction.amount || 0);

        items.push({
          id: `transaction-${latestTransaction.id || latestTransaction.date || "latest"}`,
          type:
            latestTransaction.type === "income"
              ? "success"
              : "info",
          icon:
            latestTransaction.type === "income"
              ? "↗"
              : "↘",
          title:
            latestTransaction.type === "income"
              ? "Income recorded"
              : "Expense recorded",
          message: `${latestTransaction.title || latestTransaction.description || "Transaction"} — Rs.${amount.toLocaleString()}`,
          time: latestTransaction.date || "Recently"
        });
      }
    }

    if (balance < 0) {
      items.push({
        id: "negative-balance",
        type: "danger",
        icon: "!",
        title: "Negative balance",
        message:
          "Your total expenses are currently higher than your total income.",
        time: "Financial alert"
      });
    } else if (balance > 0) {
      items.push({
        id: "positive-balance",
        type: "success",
        icon: "✓",
        title: "Healthy balance",
        message: `You currently have Rs.${balance.toLocaleString()} available after expenses.`,
        time: "Financial insight"
      });
    }

    safeRecurringTransactions.forEach((transaction, index) => {
      if (transaction && transaction.nextDate) {
        const nextDate = new Date(transaction.nextDate);
        const today = new Date();

        const difference =
          Math.ceil(
            (nextDate - today) /
              (1000 * 60 * 60 * 24)
          );

        if (difference >= 0 && difference <= 3) {
          items.push({
            id: `recurring-${transaction.id || index}`,
            type: "warning",
            icon: "↻",
            title: "Recurring payment coming up",
            message: `${
              transaction.title ||
              transaction.description ||
              "Recurring transaction"
            } is scheduled soon.`,
            time: transaction.nextDate
          });
        }
      }
    });

    if (items.length === 0) {
      items.push({
        id: "welcome-notification",
        type: "info",
        icon: "✦",
        title: "Welcome to ExpenseFlow",
        message:
          "Start adding transactions to receive smart financial notifications.",
        time: "Getting started"
      });
    }

    return items;
  }, [transactions, budget, recurringTransactions]);

  const unreadNotifications = useMemo(() => {
    const safeReadNotificationIds = Array.isArray(
      readNotificationIds
    )
      ? readNotificationIds
      : [];

    return notifications.filter(
      (notification) =>
        !safeReadNotificationIds.includes(
          notification.id
        )
    );
  }, [notifications, readNotificationIds]);

  useEffect(() => {
    onUnreadCountChange(unreadNotifications.length);
  }, [unreadNotifications.length, onUnreadCountChange]);

  const displayedNotifications =
    filter === "unread"
      ? unreadNotifications
      : notifications;

  const handleMarkAllRead = () => {
    markAllNotificationsRead(
      unreadNotifications.map(
        (notification) => notification.id
      )
    );
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

          <h2>Notifications</h2>

          <p>
            Stay updated with your financial activity
            and important alerts.
          </p>
        </div>

        <div className="notification-actions">
          <button
            className={`notification-filter ${
              filter === "all" ? "active" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={`notification-filter ${
              filter === "unread" ? "active" : ""
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread
            {unreadNotifications.length > 0 && (
              <span className="notification-filter-count">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {unreadNotifications.length > 0 && (
            <button
              className="mark-all-read-button"
              onClick={handleMarkAllRead}
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
            {unreadNotifications.length === 1
              ? "notification needs your attention"
              : "notifications need your attention"}
          </span>
        </div>
      </div>

      <div className="notification-list">
        {displayedNotifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">
              ✓
            </div>

            <h3>You're all caught up</h3>

            <p>
              There are no unread notifications right
              now.
            </p>
          </div>
        ) : (
          displayedNotifications.map(
            (notification) => {
              const isRead = Array.isArray(
                readNotificationIds
              )
                ? readNotificationIds.includes(
                    notification.id
                  )
                : false;

              return (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    isRead ? "read" : "unread"
                  }`}
                >
                  <div
                    className={`notification-icon ${getNotificationClass(
                      notification.type
                    )}`}
                  >
                    {notification.icon}
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
                      {notification.time}
                    </span>
                  </div>

                  {!isRead && (
                    <button
                      className="notification-read-button"
                      onClick={() =>
                        markNotificationRead(
                          notification.id
                        )
                      }
                      aria-label={`Mark ${notification.title} as read`}
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