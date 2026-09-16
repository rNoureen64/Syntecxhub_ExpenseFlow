function CategoryBreakdown({ transactions }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const categoryTotals = {};

  transactions
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
    .forEach((transaction) => {
      const category = transaction.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(transaction.amount);
    });

  const categories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  const totalExpenses = categories.reduce(
    (total, [, amount]) => total + amount,
    0
  );

  const monthName = now.toLocaleString("en-US", {
    month: "long"
  });

  return (
    <div className="category-breakdown">
      <div className="category-breakdown-header">
        <div>
          <span className="category-eyebrow">
            SPENDING BREAKDOWN
          </span>

          <h2>Where Your Money Goes</h2>

          <p>
            Category-wise spending for {monthName}
          </p>
        </div>

        <div className="category-total">
          <span>Total Spent</span>

          <strong>
            Rs. {totalExpenses.toLocaleString()}
          </strong>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="category-empty">
          <div className="category-empty-icon">
            ◌
          </div>

          <h3>No spending data yet</h3>

          <p>
            Add an expense to see your spending breakdown.
          </p>
        </div>
      ) : (
        <div className="category-list">
          {categories.map(([category, amount]) => {
            const percentage =
              totalExpenses > 0
                ? Math.round(
                    (amount / totalExpenses) * 100
                  )
                : 0;

            return (
              <div
                className="category-row"
                key={category}
              >
                <div className="category-row-top">
                  <div>
                    <strong>{category}</strong>

                    <span>
                      Rs. {amount.toLocaleString()}
                    </span>
                  </div>

                  <strong>{percentage}%</strong>
                </div>

                <div className="category-progress">
                  <div
                    className="category-progress-fill"
                    style={{
                      width: `${percentage}%`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoryBreakdown;