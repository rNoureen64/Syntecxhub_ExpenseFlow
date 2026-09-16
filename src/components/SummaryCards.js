
function SummaryCards({ transactions }) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const balance = totalIncome - totalExpenses;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlyTransactions = transactions.filter((transaction) => {
    if (!transaction.date) {
      return false;
    }

    const transactionDate = new Date(`${transaction.date}T00:00:00`);

    return (
      transactionDate.getFullYear() === currentYear &&
      transactionDate.getMonth() === currentMonth
    );
  });

  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const monthlyExpenses = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const monthlySavings = monthlyIncome - monthlyExpenses;

  const spendingRate =
    monthlyIncome > 0
      ? Math.min(
          Math.round((monthlyExpenses / monthlyIncome) * 100),
          100
        )
      : 0;

  const monthName = now.toLocaleString("en-US", {
    month: "long"
  });

  let healthStatus = "Balanced";
  let healthMessage =
    "Your income and expenses are currently balanced.";
  let healthClass = "balanced";

  if (totalIncome === 0 && totalExpenses === 0) {
    healthStatus = "Getting Started";
    healthMessage =
      "Add your income and expenses to understand your financial health.";
    healthClass = "neutral";
  } else if (balance > totalIncome * 0.2) {
    healthStatus = "Healthy";
    healthMessage =
      "Great job! Your income is comfortably higher than your expenses.";
    healthClass = "healthy";
  } else if (balance >= 0) {
    healthStatus = "Balanced";
    healthMessage =
      "Your finances are stable, but there is room to improve your savings.";
    healthClass = "balanced";
  } else {
    healthStatus = "Needs Attention";
    healthMessage =
      "Your expenses are currently higher than your income.";
    healthClass = "attention";
  }

  return (
    <>
      <div className="summary-cards">
        <div className="summary-card balance-card">
          <div className="summary-card-top">
            <span className="summary-label">Current Balance</span>
            <span className="summary-icon">₨</span>
          </div>

          <h2>Rs. {balance.toLocaleString()}</h2>

          <p>
            {balance >= 0
              ? "Your finances are in a healthy position"
              : "Your expenses are higher than your income"}
          </p>
        </div>

        <div className="summary-card income-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Income</span>
            <span className="summary-icon">↗</span>
          </div>

          <h2>Rs. {totalIncome.toLocaleString()}</h2>

          <p>Money received so far</p>
        </div>

        <div className="summary-card expense-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Expenses</span>
            <span className="summary-icon">↘</span>
          </div>

          <h2>Rs. {totalExpenses.toLocaleString()}</h2>

          <p>Money spent so far</p>
        </div>

        <div className="summary-card transaction-card">
          <div className="summary-card-top">
            <span className="summary-label">Transactions</span>
            <span className="summary-icon">#</span>
          </div>

          <h2>{transactions.length}</h2>

          <p>Total recorded transactions</p>
        </div>
      </div>

      <div className={`financial-health ${healthClass}`}>
        <div className="health-left">
          <div className="health-icon">
            {healthClass === "healthy" && "✓"}
            {healthClass === "balanced" && "≈"}
            {healthClass === "attention" && "!"}
            {healthClass === "neutral" && "•"}
          </div>

          <div className="health-content">
            <div className="health-title-row">
              <h3>Financial Health</h3>

              <span className="health-status">
                {healthStatus}
              </span>
            </div>

            <p>{healthMessage}</p>
          </div>
        </div>

        <div className="health-balance">
          <span>Net Balance</span>

          <strong>
            Rs. {balance.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="monthly-overview">
        <div className="monthly-header">
          <div>
            <span className="monthly-eyebrow">
              MONTHLY OVERVIEW
            </span>

            <h2>{monthName} Spending</h2>

            <p>
              Your financial activity for this month
            </p>
          </div>

          <div className="monthly-rate">
            <span>Spending Rate</span>
            <strong>{spendingRate}%</strong>
          </div>
        </div>

        <div className="monthly-progress">
          <div
            className="monthly-progress-fill"
            style={{ width: `${spendingRate}%` }}
          ></div>
        </div>

        <div className="monthly-stats">
          <div className="monthly-stat">
            <span>Income</span>
            <strong>
              Rs. {monthlyIncome.toLocaleString()}
            </strong>
          </div>

          <div className="monthly-stat">
            <span>Expenses</span>
            <strong>
              Rs. {monthlyExpenses.toLocaleString()}
            </strong>
          </div>

          <div className="monthly-stat">
            <span>Saved</span>
            <strong
              className={
                monthlySavings >= 0
                  ? "monthly-positive"
                  : "monthly-negative"
              }
            >
              Rs. {monthlySavings.toLocaleString()}
            </strong>
          </div>

          <div className="monthly-stat">
            <span>Transactions</span>
            <strong>
              {monthlyTransactions.length}
            </strong>
          </div>
        </div>
      </div>
    </>
  );
}

export default SummaryCards;
