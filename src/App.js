import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import "./App.css";

import Sidebar from "./components/sidebar/Sidebar";
import SummaryCards from "./components/SummaryCards";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import AnalyticsChart from "./components/AnalyticsChart";
import Toast from "./components/Toast";
import BudgetCard from "./components/BudgetCard";
import QuickActions from "./components/QuickActions";
import DashboardInsights from "./components/DashboardInsights";
import ExportButton from "./components/ExportButton";
import CategoryBreakdown from "./components/CategoryBreakdown";
import RecurringTransactions from "./components/RecurringTransactions";
import NotificationCenter from "./components/NotificationCenter";
import UserProfile from "./components/UserProfile";
import BackupRestore from "./components/BackupRestore";

import mockTransactions from "./data/mockTransactions";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("expenseFlowTransactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });

  const [recurringTransactions, setRecurringTransactions] =
    useState(() => {
      const savedRecurring =
        localStorage.getItem(
          "expenseFlowRecurringTransactions"
        );

      return savedRecurring
        ? JSON.parse(savedRecurring)
        : [];
    });

  const [budget, setBudget] = useState(() => {
    const savedBudget =
      localStorage.getItem("expenseFlowBudget");

    return savedBudget
      ? Number(savedBudget)
      : 0;
  });

  const [readNotifications, setReadNotifications] =
    useState(() => {
      const savedReadNotifications =
        localStorage.getItem(
          "expenseFlowReadNotifications"
        );

      return savedReadNotifications
        ? JSON.parse(savedReadNotifications)
        : [];
    });

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem(
        "expenseFlowDarkMode"
      ) === "true"
    );
  });

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [toast, setToast] = useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [apiLoading, setApiLoading] =
    useState(() => {
      const savedTransactions =
        localStorage.getItem(
          "expenseFlowTransactions"
        );

      return !savedTransactions;
    });

  const [apiError, setApiError] =
    useState("");

  const [dataAction, setDataAction] =
    useState(null);

  const mainContentRef = useRef(null);

  /* =====================================================
     MOCK API LOAD
     ===================================================== */

  useEffect(() => {
    const savedTransactions =
      localStorage.getItem(
        "expenseFlowTransactions"
      );

    if (savedTransactions) {
      setApiLoading(false);
      return;
    }

    setApiLoading(true);
    setApiError("");

    const timer = setTimeout(() => {
      try {
        setTransactions(mockTransactions);
        setApiLoading(false);
      } catch (error) {
        console.error(error);

        setApiError(
          "Unable to load your financial data."
        );

        setApiLoading(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  /* =====================================================
     SECTION NAVIGATION
     ===================================================== */

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [activeSection]);

  /* =====================================================
     LOCAL STORAGE
     ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "expenseFlowTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "expenseFlowRecurringTransactions",
      JSON.stringify(
        recurringTransactions
      )
    );
  }, [recurringTransactions]);

  useEffect(() => {
    localStorage.setItem(
      "expenseFlowBudget",
      String(budget)
    );
  }, [budget]);

  useEffect(() => {
    localStorage.setItem(
      "expenseFlowReadNotifications",
      JSON.stringify(readNotifications)
    );
  }, [readNotifications]);

  useEffect(() => {
    localStorage.setItem(
      "expenseFlowDarkMode",
      String(darkMode)
    );
  }, [darkMode]);

  /* =====================================================
     DARK MODE BODY CLASS
     ===================================================== */

  useEffect(() => {
    document.body.classList.toggle(
      "dark-theme",
      darkMode
    );

    return () => {
      document.body.classList.remove(
        "dark-theme"
      );
    };
  }, [darkMode]);

  /* =====================================================
     TOAST
     ===================================================== */

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type
    });
  };

  const closeToast = () => {
    setToast(null);
  };

  const showValidationToast = (
    message
  ) => {
    showToast(
      message,
      "error"
    );
  };

  /* =====================================================
     ADD TRANSACTION
     ===================================================== */

  const addTransaction = (
    transaction
  ) => {
    const newTransaction = {
      ...transaction,
      id:
        Date.now() +
        Math.random()
          .toString(36)
          .slice(2, 8)
    };

    setTransactions((previous) => [
      newTransaction,
      ...previous
    ]);

    showToast(
      "Transaction added successfully.",
      "success"
    );
  };

  /* =====================================================
     UPDATE TRANSACTION
     ===================================================== */

  const updateTransaction = (
    updatedTransaction
  ) => {
    setTransactions((previous) =>
      previous.map((transaction) =>
        transaction.id ===
        updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );

    setEditingTransaction(null);

    showToast(
      "Transaction updated successfully.",
      "success"
    );
  };

  /* =====================================================
     EDIT TRANSACTION
     ===================================================== */

  const startEditing = (
    transaction
  ) => {
    setEditingTransaction(
      transaction
    );
  };

  /* =====================================================
     DELETE TRANSACTION
     ===================================================== */

  const deleteTransaction = (
    transaction
  ) => {
    setDeleteTarget(transaction);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setTransactions((previous) =>
      previous.filter(
        (transaction) =>
          transaction.id !==
          deleteTarget.id
      )
    );

    setDeleteTarget(null);

    showToast(
      "Transaction deleted successfully.",
      "success"
    );
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  /* =====================================================
     RECURRING TRANSACTIONS
     ===================================================== */

  const addRecurringTransaction = (
    recurringTransaction
  ) => {
    const newRecurring = {
      ...recurringTransaction,
      id:
        Date.now() +
        Math.random()
          .toString(36)
          .slice(2, 8)
    };

    setRecurringTransactions(
      (previous) => [
        ...previous,
        newRecurring
      ]
    );

    showToast(
      "Recurring transaction added.",
      "success"
    );
  };

  const deleteRecurringTransaction = (
    id
  ) => {
    setRecurringTransactions(
      (previous) =>
        previous.filter(
          (item) =>
            item.id !== id
        )
    );

    showToast(
      "Recurring transaction removed.",
      "success"
    );
  };

  /* =====================================================
     PROCESS RECURRING TRANSACTIONS
     ===================================================== */

  useEffect(() => {
    if (
      recurringTransactions.length ===
      0
    ) {
      return;
    }

    const checkRecurringTransactions =
      () => {
        const today =
          new Date();

        const todayString =
          today
            .toISOString()
            .split("T")[0];

        const updatedRecurring =
          recurringTransactions.map(
            (item) => {
              if (
                !item.nextDate
              ) {
                return item;
              }

              if (
                item.nextDate <=
                todayString
              ) {
                return item;
              }

              return item;
            }
          );

        setRecurringTransactions(
          updatedRecurring
        );
      };

    checkRecurringTransactions();

    const interval =
      setInterval(
        checkRecurringTransactions,
        60000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    recurringTransactions
  ]);

  /* =====================================================
     NOTIFICATION DATA
     ===================================================== */

  const notificationItems =
    useMemo(() => {
      const notifications = [];

      const currentDate =
        new Date();

      const currentMonth =
        currentDate.getMonth();

      const currentYear =
        currentDate.getFullYear();

      const monthlyExpenses =
        transactions
          .filter(
            (transaction) =>
              transaction.type ===
                "expense" &&
              new Date(
                transaction.date
              ).getMonth() ===
                currentMonth &&
              new Date(
                transaction.date
              ).getFullYear() ===
                currentYear
          )
          .reduce(
            (
              total,
              transaction
            ) =>
              total +
              Number(
                transaction.amount
              ),
            0
          );

      if (budget > 0) {
        const budgetPercentage =
          (monthlyExpenses /
            budget) *
          100;

        if (
          budgetPercentage >=
          100
        ) {
          notifications.push({
            id: "budget-exceeded",
            type: "danger",
            title:
              "Budget exceeded",
            message:
              "Your monthly expenses have exceeded your planned budget."
          });
        } else if (
          budgetPercentage >=
          80
        ) {
          notifications.push({
            id: "budget-warning",
            type: "warning",
            title:
              "Budget warning",
            message:
              "You have used more than 80% of your monthly budget."
          });
        }
      }

      recurringTransactions.forEach(
        (item) => {
          if (!item.nextDate) {
            return;
          }

          const nextDate =
            new Date(
              item.nextDate
            );

          const difference =
            Math.ceil(
              (
                nextDate -
                currentDate
              ) /
                (
                  1000 *
                  60 *
                  60 *
                  24
                )
            );

          if (
            difference >= 0 &&
            difference <= 3
          ) {
            notifications.push({
              id:
                `recurring-${item.id}`,
              type: "info",
              title:
                "Recurring payment coming up",
              message:
                `${item.title} is scheduled soon.`
            });
          }
        }
      );

      if (
        transactions.length ===
        0
      ) {
        notifications.push({
          id: "welcome",
          type: "success",
          title:
            "Welcome to ExpenseFlow",
          message:
            "Start adding transactions to understand your financial activity."
        });
      }

      return notifications;
    }, [
      transactions,
      budget,
      recurringTransactions
    ]);

  const dashboardNotificationCount =
    notificationItems.filter(
      (notification) =>
        !readNotifications.includes(
          notification.id
        )
    ).length;

  /* =====================================================
     NOTIFICATION ACTIONS
     ===================================================== */

  const markNotificationAsRead = (
    id
  ) => {
    setReadNotifications(
      (previous) => {
        if (
          previous.includes(id)
        ) {
          return previous;
        }

        return [
          ...previous,
          id
        ];
      }
    );
  };

  const markAllNotificationsAsRead =
    () => {
      setReadNotifications(
        notificationItems.map(
          (notification) =>
            notification.id
        )
      );

      showToast(
        "All notifications marked as read.",
        "success"
      );
    };

  /* =====================================================
     DATA MANAGEMENT
     ===================================================== */

  const clearAllTransactions =
    () => {
      setTransactions([]);

      showToast(
        "All transactions cleared.",
        "success"
      );
    };

  const resetBudget = () => {
    setBudget(0);

    showToast(
      "Budget reset successfully.",
      "success"
    );
  };

  const resetNotifications =
    () => {
      setReadNotifications([]);

      showToast(
        "Notifications reset.",
        "success"
      );
    };

  const resetRecurringTransactions =
    () => {
      setRecurringTransactions(
        []
      );

      showToast(
        "Recurring transactions cleared.",
        "success"
      );
    };

  const resetAllData = () => {
    setTransactions([]);
    setRecurringTransactions([]);
    setBudget(0);
    setReadNotifications([]);

    localStorage.removeItem(
      "expenseFlowTransactions"
    );

    localStorage.removeItem(
      "expenseFlowRecurringTransactions"
    );

    localStorage.removeItem(
      "expenseFlowBudget"
    );

    localStorage.removeItem(
      "expenseFlowReadNotifications"
    );

    showToast(
      "ExpenseFlow has been reset successfully.",
      "success"
    );
  };

  /* =====================================================
     DATA ACTION CONFIRMATION
     ===================================================== */

  const executeDataAction = () => {
    if (!dataAction) {
      return;
    }

    if (
      dataAction ===
      "budget"
    ) {
      resetBudget();
    }

    if (
      dataAction ===
      "notifications"
    ) {
      resetNotifications();
    }

    if (
      dataAction ===
      "recurring"
    ) {
      resetRecurringTransactions();
    }

    if (
      dataAction ===
      "transactions"
    ) {
      clearAllTransactions();
    }

    if (
      dataAction ===
      "everything"
    ) {
      resetAllData();
    }

    setDataAction(null);
  };

  /* =====================================================
     BACKUP RESTORE
     ===================================================== */

  const handleRestoreBackup =
    (backupData) => {
      try {
        if (
          backupData.transactions
        ) {
          setTransactions(
            backupData.transactions
          );
        }

        if (
          backupData.recurringTransactions
        ) {
          setRecurringTransactions(
            backupData.recurringTransactions
          );
        }

        if (
          typeof backupData.budget ===
          "number"
        ) {
          setBudget(
            backupData.budget
          );
        }

        if (
          backupData.readNotifications
        ) {
          setReadNotifications(
            backupData.readNotifications
          );
        }

        showToast(
          "Backup restored successfully.",
          "success"
        );
      } catch (error) {
        console.error(error);

        showToast(
          "Unable to restore backup.",
          "error"
        );
      }
    };

  /* =====================================================
     RETRY MOCK API
     ===================================================== */

  const retryApiLoad = () => {
    setApiLoading(true);
    setApiError("");

    setTimeout(() => {
      try {
        setTransactions(
          mockTransactions
        );

        setApiLoading(false);
      } catch (error) {
        console.error(error);

        setApiError(
          "Unable to load financial data."
        );

        setApiLoading(false);
      }
    }, 1000);
  };

  /* =====================================================
     LOADING SCREEN
     ===================================================== */

  if (apiLoading) {
    return (
      <div
        className={`app-loading-screen ${
          darkMode
            ? "dark-mode"
            : ""
        }`}
      >
        <div className="loading-card">
          <div className="loading-logo">
            EF
          </div>

          <div className="loading-spinner"></div>

          <h2>
            Loading ExpenseFlow
          </h2>

          <p>
            Preparing your financial dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR SCREEN
     ===================================================== */

  if (apiError) {
    return (
      <div
        className={`app-loading-screen ${
          darkMode
            ? "dark-mode"
            : ""
        }`}
      >
        <div className="loading-card">
          <div className="loading-logo">
            EF
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {apiError}
          </p>

          <button
            className="retry-button"
            onClick={
              retryApiLoad
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN APP
     ===================================================== */

  return (
    <div
      className={`app-layout ${
        darkMode
          ? "dark-mode"
          : ""
      }`}
    >
      <Sidebar
        activeSection={
          activeSection
        }
        setActiveSection={
          setActiveSection
        }
        notificationCount={
          dashboardNotificationCount
        }
      />

      <main
        ref={mainContentRef}
        className="main-content"
      >
        
{/* =================================================
    DASHBOARD
    ================================================= */}

{activeSection === "dashboard" && (
  <>
    <div className="page-header">
      <div>
        <span className="page-eyebrow">
          FINANCIAL OVERVIEW
        </span>

        <h1>
          Dashboard
        </h1>

        <p>
          Track your money, understand your spending,
          and stay financially organized.
        </p>
      </div>

      <div className="dashboard-date">
        {new Date().toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          }
        )}
      </div>
    </div>

    <SummaryCards
      transactions={transactions}
    />

    <div className="dashboard-grid">
      <div>
        <ExpenseForm
          addTransaction={addTransaction}
          updateTransaction={updateTransaction}
          editingTransaction={editingTransaction}
          cancelEdit={() =>
            setEditingTransaction(null)
          }
          showValidationToast={showValidationToast}
        />
      </div>

      <div>
        <DashboardInsights
          transactions={transactions}
          budget={budget}
        />
      </div>
    </div>

    <BudgetCard
      transactions={transactions}
      budget={budget}
      setBudget={setBudget}
    />

    <QuickActions
      setActiveSection={setActiveSection}
    />

    <CategoryBreakdown
      transactions={transactions}
    />

    <AnalyticsChart
      transactions={transactions}
    />
  </>
)}



        {/* =================================================
            TRANSACTIONS
            ================================================= */}

        {activeSection ===
          "transactions" && (
          <>
            <div className="transactions-page-header">
              <div>
                <span className="page-eyebrow">
                  MONEY ACTIVITY
                </span>

                <h1>
                  Transactions
                </h1>

                <p>
                  Review, search,
                  edit, and manage
                  all your financial
                  transactions.
                </p>
              </div>

              <ExportButton
                transactions={
                  transactions
                }
              />
            </div>

            <ExpenseList
              transactions={
                transactions
              }
              startEditing={
                startEditing
              }
              deleteTransaction={
                deleteTransaction
              }
            />
          </>
        )}

        {/* =================================================
            RECURRING
            ================================================= */}

        {activeSection ===
          "recurring" && (
          <>
            <div className="page-header">
              <div>
                <span className="page-eyebrow">
                  AUTOMATION
                </span>

                <h1>
                  Recurring
                  Transactions
                </h1>

                <p>
                  Keep track of
                  subscriptions,
                  bills, salary,
                  and other
                  repeating payments.
                </p>
              </div>
            </div>

            <RecurringTransactions
              recurringTransactions={
                recurringTransactions
              }
              setRecurringTransactions={
                setRecurringTransactions
              }
              addTransaction={
                addTransaction
              }
              addRecurringTransaction={
                addRecurringTransaction
              }
              deleteRecurringTransaction={
                deleteRecurringTransaction
              }
            />
          </>
        )}

        {/* =================================================
            NOTIFICATIONS
            ================================================= */}

        {activeSection ===
          "notifications" && (
          <>
            <div className="page-header">
              <div>
                <span className="page-eyebrow">
                  SMART ALERTS
                </span>

                <h1>
                  Notifications
                </h1>

                <p>
                  Stay updated with
                  important financial
                  activity and
                  reminders.
                </p>
              </div>
            </div>

            <NotificationCenter
              notifications={
                notificationItems
              }
              readNotifications={
                readNotifications
              }
              markNotificationAsRead={
                markNotificationAsRead
              }
              markAllNotificationsAsRead={
                markAllNotificationsAsRead
              }
            />
          </>
        )}

        {/* =================================================
            ANALYTICS
            ================================================= */}

        {activeSection ===
          "analytics" && (
          <>
            <div className="page-header">
              <div>
                <span className="page-eyebrow">
                  FINANCIAL INSIGHTS
                </span>

                <h1>
                  Analytics
                </h1>

                <p>
                  Explore your income,
                  expenses, categories,
                  and spending patterns.
                </p>
              </div>
            </div>

            <AnalyticsChart
              transactions={
                transactions
              }
            />

            <CategoryBreakdown
              transactions={
                transactions
              }
            />
          </>
        )}

        {/* =================================================
            SETTINGS
            ================================================= */}

        {activeSection ===
          "settings" && (
          <>
            <div className="page-header">
              <div>
                <span className="page-eyebrow">
                  PREFERENCES
                </span>

                <h1>
                  Settings
                </h1>

                <p>
                  Customize ExpenseFlow
                  and manage your
                  financial data.
                </p>
              </div>
            </div>

            <UserProfile />

            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <span className="settings-eyebrow">
                    APPEARANCE
                  </span>

                  <h2>
                    Theme
                  </h2>

                  <p>
                    Choose how ExpenseFlow
                    looks on your device.
                  </p>
                </div>

                <div className="theme-toggle-wrapper">
                  <button
                    className={`theme-toggle ${
                      darkMode
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setDarkMode(
                        (previous) =>
                          !previous
                      )
                    }
                    type="button"
                  >
                    <span className="theme-toggle-track">
                      <span className="theme-toggle-thumb">
                        {darkMode
                          ? "☾"
                          : "☀"}
                      </span>
                    </span>

                    <span className="theme-toggle-label">
                      {darkMode
                        ? "Dark Mode"
                        : "Light Mode"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <span className="settings-eyebrow">
                    DATA MANAGEMENT
                  </span>

                  <h2>
                    Manage Your Data
                  </h2>

                  <p>
                    Carefully manage your
                    ExpenseFlow information.
                  </p>
                </div>
              </div>

              <div className="settings-data-grid">
                <div className="settings-data-card">
                  <div className="settings-data-icon">
                    💰
                  </div>

                  <div className="settings-data-content">
                    <h3>
                      Reset Budget
                    </h3>

                    <p>
                      Remove your current
                      monthly budget.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setDataAction(
                          "budget"
                        )
                      }
                    >
                      Reset Budget
                    </button>
                  </div>
                </div>

                <div className="settings-data-card">
                  <div className="settings-data-icon">
                    🔔
                  </div>

                  <div className="settings-data-content">
                    <h3>
                      Reset Notifications
                    </h3>

                    <p>
                      Reset notification
                      read status.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setDataAction(
                          "notifications"
                        )
                      }
                    >
                      Reset Notifications
                    </button>
                  </div>
                </div>

                <div className="settings-data-card">
                  <div className="settings-data-icon">
                    ↻
                  </div>

                  <div className="settings-data-content">
                    <h3>
                      Clear Recurring
                    </h3>

                    <p>
                      Remove all recurring
                      transactions.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setDataAction(
                          "recurring"
                        )
                      }
                    >
                      Clear Recurring
                    </button>
                  </div>
                </div>

                <div className="settings-data-card danger">
                  <div className="settings-data-icon">
                    🗑
                  </div>

                  <div className="settings-data-content">
                    <h3>
                      Clear Transactions
                    </h3>

                    <p>
                      Remove all saved
                      transaction records.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setDataAction(
                          "transactions"
                        )
                      }
                    >
                      Clear Transactions
                    </button>
                  </div>
                </div>
              </div>

              <div className="reset-everything-panel">
                <div>
                  <strong>
                    Reset ExpenseFlow
                  </strong>

                  <p>
                    Remove transactions,
                    budget, recurring
                    transactions, and
                    notification data.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDataAction(
                      "everything"
                    )
                  }
                >
                  Reset Everything
                </button>
              </div>
            </div>

            <BackupRestore
              transactions={
                transactions
              }
              recurringTransactions={
                recurringTransactions
              }
              budget={budget}
              readNotifications={
                readNotifications
              }
              onRestore={
                handleRestoreBackup
              }
            />

            <div className="about-expenseflow">
              <div className="about-expenseflow-header">
                <div className="about-expenseflow-logo">
                  EF
                </div>

                <div>
                  <span className="settings-eyebrow">
                    ABOUT
                  </span>

                  <h2>
                    ExpenseFlow
                  </h2>

                  <p>
                    A modern personal
                    finance management
                    dashboard.
                  </p>
                </div>
              </div>

              <div className="about-info-grid">
                <div className="about-info-card">
                  <strong>
                    Smart Tracking
                  </strong>

                  <span>
                    Monitor income and
                    expenses in one place.
                  </span>
                </div>

                <div className="about-info-card">
                  <strong>
                    Visual Analytics
                  </strong>

                  <span>
                    Understand spending
                    through meaningful
                    insights.
                  </span>
                </div>

                <div className="about-info-card">
                  <strong>
                    Data Control
                  </strong>

                  <span>
                    Backup and restore
                    your financial data.
                  </span>
                </div>
              </div>

              <div className="about-expenseflow-footer">
                ExpenseFlow • Personal
                Finance Manager
              </div>
            </div>
          </>
        )}
      </main>

      {/* =================================================
          TOAST
          ================================================= */}

      {toast && (
        <Toast
          message={
            toast.message
          }
          type={toast.type}
          onClose={
            closeToast
          }
        />
      )}

      {/* =================================================
          DELETE CONFIRMATION MODAL
          ================================================= */}

      {deleteTarget && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              !
            </div>

            <h2>
              Delete Transaction?
            </h2>

            <p>
              Are you sure you want
              to delete{" "}
              <strong>
                {deleteTarget.title ||
                  "this transaction"}
              </strong>
              ? This action cannot
              be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={
                  cancelDelete
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={
                  confirmDelete
                }
              >
                Delete Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          DATA ACTION MODAL
          ================================================= */}

      {dataAction && (
        <div className="data-action-overlay">
          <div className="data-action-modal">
            <div className="data-action-icon">
              !
            </div>

            <h2>
              Confirm Action
            </h2>

            <p>
              {dataAction ===
                "everything"
                ? "This will remove all ExpenseFlow data. Are you sure you want to continue?"
                : "Are you sure you want to perform this action?"}
            </p>

            <div className="data-action-actions">
              <button
                type="button"
                className="data-action-cancel"
                onClick={() =>
                  setDataAction(
                    null
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="data-action-confirm"
                onClick={
                  executeDataAction
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          EDIT TRANSACTION MODAL
          ================================================= */}

      {editingTransaction && (
        <div className="delete-modal-overlay">
          <div className="edit-transaction-modal">
            <ExpenseForm
              editingTransaction={
                editingTransaction
              }
              updateTransaction={
                updateTransaction
              }
              cancelEdit={() =>
                setEditingTransaction(
                  null
                )
              }
              showValidationToast={
                showValidationToast
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;