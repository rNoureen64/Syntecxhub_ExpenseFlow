function ExportButton({ transactions }) {
  const exportTransactions = () => {
    if (transactions.length === 0) {
      alert("No transactions available to export.");
      return;
    }

    const headers = [
      "Title",
      "Amount",
      "Type",
      "Category",
      "Date"
    ];

    const rows = transactions.map((transaction) => [
      transaction.title,
      transaction.amount,
      transaction.type,
      transaction.category || "Other",
      transaction.date || ""
    ]);

    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "ExpenseFlow-Transactions.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="export-button"
      onClick={exportTransactions}
    >
      <span>↓</span>
      Export CSV
    </button>
  );
}

export default ExportButton;