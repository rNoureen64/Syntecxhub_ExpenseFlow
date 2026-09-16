
import { useState } from "react";

function ExpenseList({
  transactions,
  deleteTransaction,
  startEditing
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" || transaction.type === filter;

    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="transaction-list">
      <div className="transaction-header">
        <div>
          <h2>Recent Transactions</h2>
          <p>Manage your income and expenses</p>
        </div>

        <span className="transaction-count">
          {filteredTransactions.length} Transactions
        </span>
      </div>

      <div className="transaction-controls">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "income" ? "active" : ""}
            onClick={() => setFilter("income")}
          >
            Income
          </button>

          <button
            className={filter === "expense" ? "active" : ""}
            onClick={() => setFilter("expense")}
          >
            Expenses
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>

          <h3>No transactions found</h3>

          <p>
            Add your first transaction to start tracking your finances.
          </p>
        </div>
      ) : (
        <div className="transactions-container">
          {filteredTransactions.map((transaction) => (
            <div className="transaction-item" key={transaction.id}>
              <div className="transaction-icon">
                {transaction.type === "income" ? "↗" : "↘"}
              </div>

              <div className="transaction-info">
                <h3>{transaction.title}</h3>

                <div className="transaction-meta">
                  <span className="category-badge">
                    {transaction.category || "Other"}
                  </span>

                  <span className="transaction-date">
                    {transaction.date || "No date"}
                  </span>
                </div>
              </div>

              <div className="transaction-right">
                <strong className={transaction.type}>
                  {transaction.type === "income" ? "+" : "-"} Rs.{" "}
                  {transaction.amount}
                </strong>

                <button
                  className="edit-button"
                  onClick={() => startEditing(transaction)}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteTransaction(transaction)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;

