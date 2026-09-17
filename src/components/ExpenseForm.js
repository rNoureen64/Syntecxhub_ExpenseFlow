import { useEffect, useState } from "react";

function ExpenseForm({
  addTransaction,
  updateTransaction,
  editingTransaction,
  cancelEdit,
  showValidationToast
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category || "Other");
      setDate(editingTransaction.date || "");
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showValidationToast("Please enter a transaction title.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      showValidationToast("Please enter an amount greater than 0.");
      return;
    }

    if (!date) {
      showValidationToast("Please select a date.");
      return;
    }

    if (editingTransaction) {
      updateTransaction({
        id: editingTransaction.id,
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        date: date
      });
    } else {
      addTransaction({
        id: Date.now(),
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        date: date
      });
    }

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate("");
  };

  const handleCancel = () => {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate("");

    cancelEdit();
  };

  return (
    <div className="expense-form">
      <h2>
        {editingTransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="transaction-title">
            Title
          </label>

          <input
            id="transaction-title"
            name="title"
            type="text"
            placeholder="Enter transaction title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="transaction-amount">
            Amount
          </label>

          <input
            id="transaction-amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            inputMode="decimal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="transaction-type">
            Type
          </label>

          <select
            id="transaction-type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-category">
            Category
          </label>

          <select
            id="transaction-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-date">
            Date
          </label>

          <input
            id="transaction-date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-buttons">
          <button type="submit">
            {editingTransaction
              ? "Update Transaction"
              : "Add Transaction"}
          </button>

          {editingTransaction && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;