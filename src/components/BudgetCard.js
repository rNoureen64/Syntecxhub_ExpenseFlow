
import React from "react";function BudgetCard({ transactions, budget, setBudget }) {
  const [budgetInput, setBudgetInput] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlyExpenses = transactions
    .filter((transaction) => {
      if (transaction.type !== "expense" || !transaction.date) {
        return false;
      }

      const transactionDate = new Date(
        `${transaction.date}T00:00:00`
      );

      return (
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() === currentMonth
      );
    })
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const remaining = budget - monthlyExpenses;

  const usagePercentage =
    budget > 0
      ? Math.round((monthlyExpenses / budget) * 100)
      : 0;

  const progressPercentage = Math.min(usagePercentage, 100);

  let status = "No Budget Set";
  let statusClass = "no-budget";
  let alertTitle = "";
  let alertMessage = "";

  if (budget > 0) {
    if (usagePercentage > 100) {
      status = "Budget Exceeded";
      statusClass = "exceeded";
      alertTitle = "Budget Alert";
      alertMessage = `You have exceeded your monthly budget by Rs. ${Math.abs(
        remaining
      ).toLocaleString()}.`;
    } else if (usagePercentage >= 100) {
      status = "Budget Limit Reached";
      statusClass = "exceeded";
      alertTitle = "Budget Alert";
      alertMessage =
        "You have reached your monthly spending limit.";
    } else if (usagePercentage >= 80) {
      status = "Getting Close";
      statusClass = "warning";
      alertTitle = "Spending Warning";
      alertMessage = `You have used ${usagePercentage}% of your monthly budget. Consider reducing your spending.`;
    } else {
      status = "Under Control";
      statusClass = "safe";
      alertTitle = "Budget on Track";
      alertMessage = `You are doing well. You have Rs. ${remaining.toLocaleString()} remaining this month.`;
    }
  }

  const handleBudgetSave = (e) => {
    e.preventDefault();

    const newBudget = Number(budgetInput);

    if (!newBudget || newBudget <= 0) {
      return;
    }

    setBudget(newBudget);
    setBudgetInput("");
    setIsEditing(false);
  };

  const handleEdit = () => {
    setBudgetInput(budget);
    setIsEditing(true);
  };

  const handleReset = () => {
    setBudget(0);
    setBudgetInput("");
    setIsEditing(false);
  };

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div>
          <span className="budget-eyebrow">
            BUDGET PLANNER
          </span>

          <h2>Monthly Budget</h2>

          <p>
            Keep your spending within your planned limit
          </p>
        </div>

        <span className={`budget-status ${statusClass}`}>
          {status}
        </span>
      </div>

      {budget === 0 || isEditing ? (
        <form
          className="budget-setup"
          onSubmit={handleBudgetSave}
        >
          <div className="budget-input-wrapper">
            <span>Rs.</span>

            <input
  id="monthly-budget"
  name="monthlyBudget"
  type="number"
  placeholder="Enter monthly budget"
  value={budgetInput}
  onChange={(e) =>
    setBudgetInput(e.target.value)
  }
  min="1"
  step="1"
  inputMode="numeric"
/>
          </div>

          <button type="submit">
            {isEditing ? "Update Budget" : "Set Budget"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="budget-cancel-button"
              onClick={() => {
                setIsEditing(false);
                setBudgetInput("");
              }}
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <>
          <div className="budget-main">
            <div>
              <span className="budget-label">
                Monthly Limit
              </span>

              <strong>
                Rs. {budget.toLocaleString()}
              </strong>
            </div>

            <div className="budget-percentage">
              <strong>{usagePercentage}%</strong>
              <span>used</span>
            </div>
          </div>

          <div className="budget-progress">
            <div
              className={`budget-progress-fill ${statusClass}`}
              style={{
                width: `${progressPercentage}%`
              }}
            ></div>
          </div>

          <div className="budget-stats">
            <div>
              <span>Spent</span>

              <strong>
                Rs. {monthlyExpenses.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>
                {remaining >= 0
                  ? "Remaining"
                  : "Over Budget"}
              </span>

              <strong
                className={
                  remaining >= 0
                    ? "budget-positive"
                    : "budget-negative"
                }
              >
                Rs. {Math.abs(
                  remaining
                ).toLocaleString()}
              </strong>
            </div>
          </div>

          <div
            className={`budget-alert ${statusClass}`}
          >
            <div className="budget-alert-icon">
              {usagePercentage >= 80 ? "!" : "✓"}
            </div>

            <div>
              <strong>{alertTitle}</strong>

              <p>{alertMessage}</p>
            </div>
          </div>

          <div className="budget-actions">
            <button
              className="budget-edit-button"
              onClick={handleEdit}
            >
              Edit Budget
            </button>

            <button
              className="budget-reset-button"
              onClick={handleReset}
            >
              Reset Budget
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BudgetCard;