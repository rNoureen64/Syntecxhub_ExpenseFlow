function DashboardInsights({ transactions }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const income = transactions.filter(
    (transaction) => transaction.type === "income"
  );

  const totalIncome = income.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  const totalExpenses = expenses.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    const category = transaction.category || "Other";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(transaction.amount);
  });

  let highestCategory = "No expenses yet";
  let highestCategoryAmount = 0;

  Object.entries(categoryTotals).forEach(
    ([category, amount]) => {
      if (amount > highestCategoryAmount) {
        highestCategory = category;
        highestCategoryAmount = amount;
      }
    }
  );

  const latestTransaction =
    transactions.length > 0
      ? [...transactions].sort(
          (a, b) =>
            new Date(b.date) - new Date(a.date)
        )[0]
      : null;

  const savingsRate =
    totalIncome > 0
      ? Math.round(
          ((totalIncome - totalExpenses) /
            totalIncome) *
            100
        )
      : 0;

  return (
    <div className="dashboard-insights">
      <div className="insights-header">
        <div>
          <span className="insights-eyebrow">
            FINANCIAL INSIGHTS
          </span>

          <h2>Quick Financial Snapshot</h2>

          <p>
            A smart overview of your current financial activity
          </p>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-item">
          <span className="insight-label">
            Total Activity
          </span>

          <strong>
            {transactions.length}
          </strong>

          <p>
            {transactions.length === 1
              ? "transaction recorded"
              : "transactions recorded"}
          </p>
        </div>

        <div className="insight-item">
          <span className="insight-label">
            Top Spending
          </span>

          <strong>
            {highestCategory}
          </strong>

          <p>
            {highestCategoryAmount > 0
              ? `Rs. ${highestCategoryAmount.toLocaleString()} spent`
              : "No spending recorded"}
          </p>
        </div>

        <div className="insight-item">
          <span className="insight-label">
            Savings Rate
          </span>

          <strong>
            {savingsRate}%
          </strong>

          <p>
            Based on total income and expenses
          </p>
        </div>

        <div className="insight-item">
          <span className="insight-label">
            Latest Activity
          </span>

          <strong>
            {latestTransaction
              ? latestTransaction.title
              : "No activity"}
          </strong>

          <p>
            {latestTransaction
              ? `${latestTransaction.type === "income" ? "+" : "-"} Rs. ${Number(
                  latestTransaction.amount
                ).toLocaleString()}`
              : "Add a transaction to begin"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardInsights;