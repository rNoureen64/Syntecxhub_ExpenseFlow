function QuickActions({ setActiveSection }) {
  const handleAddExpense = () => {
    setActiveSection("dashboard");

    setTimeout(() => {
      document
        .querySelector(".expense-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
    }, 100);
  };

  const handleAnalytics = () => {
    setActiveSection("analytics");
  };

  const handleTransactions = () => {
    setActiveSection("transactions");
  };

  return (
    <div className="quick-actions">
      <div className="quick-actions-header">
        <div>
          <span className="quick-eyebrow">
            QUICK ACTIONS
          </span>

          <h2>Manage Your Finances</h2>

          <p>
            Quickly access the tools you use most
          </p>
        </div>
      </div>

      <div className="quick-actions-grid">
        <button
          className="quick-action-card primary"
          onClick={handleAddExpense}
        >
          <div className="quick-action-icon">
            +
          </div>

          <div className="quick-action-content">
            <strong>Add Transaction</strong>
            <span>Record income or expense</span>
          </div>

          <div className="quick-arrow">
            →
          </div>
        </button>

        <button
          className="quick-action-card"
          onClick={handleTransactions}
        >
          <div className="quick-action-icon">
            ≡
          </div>

          <div className="quick-action-content">
            <strong>Transactions</strong>
            <span>View your financial history</span>
          </div>

          <div className="quick-arrow">
            →
          </div>
        </button>

        <button
          className="quick-action-card"
          onClick={handleAnalytics}
        >
          <div className="quick-action-icon">
            ↗
          </div>

          <div className="quick-action-content">
            <strong>View Analytics</strong>
            <span>Understand spending patterns</span>
          </div>

          <div className="quick-arrow">
            →
          </div>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;