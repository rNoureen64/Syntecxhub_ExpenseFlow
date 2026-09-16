
import { useEffect, useState } from "react";

function RecurringTransactions({ addTransaction }) {
  const [recurringTransactions, setRecurringTransactions] =
    useState(() => {
      const saved = localStorage.getItem(
        "recurringTransactions"
      );

      return saved ? JSON.parse(saved) : [];
    });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Bills");
  const [frequency, setFrequency] = useState("Monthly");

  useEffect(() => {
    localStorage.setItem(
      "recurringTransactions",
      JSON.stringify(recurringTransactions)
    );
  }, [recurringTransactions]);

  const calculateNextDate = () => {
    const date = new Date();

    if (frequency === "Weekly") {
      date.setDate(date.getDate() + 7);
    } else if (frequency === "Monthly") {
      date.setMonth(date.getMonth() + 1);
    } else if (frequency === "Yearly") {
      date.setFullYear(date.getFullYear() + 1);
    }

    return date.toISOString().split("T")[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !amount ||
      Number(amount) <= 0
    ) {
      return;
    }

    const newRecurringTransaction = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      frequency,
      nextDate: calculateNextDate(),
      active: true
    };

    setRecurringTransactions([
      ...recurringTransactions,
      newRecurringTransaction
    ]);

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Bills");
    setFrequency("Monthly");
  };

  const toggleStatus = (id) => {
    setRecurringTransactions(
      recurringTransactions.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              active: !transaction.active
            }
          : transaction
      )
    );
  };

  const deleteRecurringTransaction = (id) => {
    setRecurringTransactions(
      recurringTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  const addRecurringAsTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: new Date().toISOString().split("T")[0]
    };

    addTransaction(newTransaction);

    const nextDate = new Date(
      transaction.nextDate
    );

    if (transaction.frequency === "Weekly") {
      nextDate.setDate(
        nextDate.getDate() + 7
      );
    } else if (transaction.frequency === "Monthly") {
      nextDate.setMonth(
        nextDate.getMonth() + 1
      );
    } else if (transaction.frequency === "Yearly") {
      nextDate.setFullYear(
        nextDate.getFullYear() + 1
      );
    }

    setRecurringTransactions(
      recurringTransactions.map((item) =>
        item.id === transaction.id
          ? {
              ...item,
              nextDate: nextDate
                .toISOString()
                .split("T")[0]
            }
          : item
      )
    );
  };

  return (
    <div className="recurring-transactions">

      <div className="recurring-header">

        <div>

          <span className="recurring-eyebrow">
            AUTOMATED FINANCE
          </span>

          <h2>
            Recurring Transactions
          </h2>

          <p>
            Keep track of regular income and expenses
          </p>

        </div>

        <div className="recurring-count">

          <span>
            Active
          </span>

          <strong>
            {
              recurringTransactions.filter(
                (transaction) =>
                  transaction.active
              ).length
            }
          </strong>

        </div>

      </div>

      <form
        className="recurring-form"
        onSubmit={handleSubmit}
      >

        <div className="recurring-field">

          <label>
            Transaction Name
          </label>

          <input
            type="text"
            placeholder="e.g. Internet Bill"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

        </div>

        <div className="recurring-field">

          <label>
            Amount
          </label>

          <div className="recurring-amount-input">

            <span>
              Rs.
            </span>

            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              min="1"
            />

          </div>

        </div>

        <div className="recurring-field">

          <label>
            Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="expense">
              Expense
            </option>

            <option value="income">
              Income
            </option>

          </select>

        </div>

        <div className="recurring-field">

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="Bills">
              Bills
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Shopping">
              Shopping
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Entertainment">
              Entertainment
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Salary">
              Salary
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>

        <div className="recurring-field">

          <label>
            Frequency
          </label>

          <select
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value)
            }
          >

            <option value="Weekly">
              Weekly
            </option>

            <option value="Monthly">
              Monthly
            </option>

            <option value="Yearly">
              Yearly
            </option>

          </select>

        </div>

        <button
          type="submit"
          className="recurring-add-button"
        >
          + Add Recurring
        </button>

      </form>

      <div className="recurring-list">

        {recurringTransactions.length === 0 ? (

          <div className="recurring-empty">

            <div className="recurring-empty-icon">
              ↻
            </div>

            <h3>
              No recurring transactions
            </h3>

            <p>
              Add your regular bills, subscriptions,
              salary or other repeating transactions.
            </p>

          </div>

        ) : (

          recurringTransactions.map(
            (transaction) => (

              <div
                className={`recurring-item ${
                  transaction.active
                    ? ""
                    : "inactive"
                }`}
                key={transaction.id}
              >

                <div className="recurring-item-main">

                  <div className="recurring-icon">

                    {transaction.type === "income"
                      ? "+"
                      : "−"}

                  </div>

                  <div>

                    <strong>
                      {transaction.title}
                    </strong>

                    <span>
                      {transaction.category} •{" "}
                      {transaction.frequency}
                    </span>

                  </div>

                </div>

                <div className="recurring-item-amount">

                  <strong
                    className={
                      transaction.type === "income"
                        ? "income"
                        : "expense"
                    }
                  >

                    {transaction.type === "income"
                      ? "+"
                      : "-"}{" "}

                    Rs.{" "}
                    {transaction.amount.toLocaleString()}

                  </strong>

                  <span>
                    Next:{" "}
                    {transaction.nextDate}
                  </span>

                </div>

                <div className="recurring-item-actions">

                  {transaction.active && (

                    <button
                      className="recurring-add-now"
                      onClick={() =>
                        addRecurringAsTransaction(
                          transaction
                        )
                      }
                    >
                      Add Now
                    </button>

                  )}

                  <button
                    className={
                      transaction.active
                        ? "recurring-toggle active"
                        : "recurring-toggle"
                    }
                    onClick={() =>
                      toggleStatus(
                        transaction.id
                      )
                    }
                  >

                    {transaction.active
                      ? "Active"
                      : "Paused"}

                  </button>

                  <button
                    className="recurring-delete"
                    onClick={() =>
                      deleteRecurringTransaction(
                        transaction.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default RecurringTransactions;
