import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function AnalyticsChart({ transactions }) {
  const [period, setPeriod] = useState("all");

  const filteredTransactions = useMemo(() => {
    const today = new Date();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(
        transaction.date
      );

      if (period === "all") {
        return true;
      }

      if (period === "month") {
        return (
          transactionDate.getMonth() ===
            today.getMonth() &&
          transactionDate.getFullYear() ===
            today.getFullYear()
        );
      }

      if (period === "lastMonth") {
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );

        return (
          transactionDate.getMonth() ===
            lastMonth.getMonth() &&
          transactionDate.getFullYear() ===
            lastMonth.getFullYear()
        );
      }

      if (period === "year") {
        return (
          transactionDate.getFullYear() ===
          today.getFullYear()
        );
      }

      return true;
    });
  }, [transactions, period]);

  const analyticsData = useMemo(() => {
    const categories = {};

    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .forEach((transaction) => {
        const category =
          transaction.category || "Other";

        if (!categories[category]) {
          categories[category] = 0;
        }

        categories[category] += Number(
          transaction.amount
        );
      });

    return Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort(
        (a, b) =>
          b.amount - a.amount
      );
  }, [filteredTransactions]);

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const expenses = filteredTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const balance = income - expenses;

    return {
      income,
      expenses,
      balance
    };
  }, [filteredTransactions]);

  const formatCurrency = (amount) => {
    return `Rs. ${Math.round(
      amount
    ).toLocaleString()}`;
  };

  const getPeriodLabel = () => {
    if (period === "month") {
      return "This Month";
    }

    if (period === "lastMonth") {
      return "Last Month";
    }

    if (period === "year") {
      return "This Year";
    }

    return "All Time";
  };

  return (
    <div className="analytics-card">

      <div className="analytics-header">

        <div>

          <span className="analytics-eyebrow">
            FINANCIAL ANALYTICS
          </span>

          <h2>
            Spending Analysis
          </h2>

          <p>
            Understand where your money is going
          </p>

        </div>

        <div className="analytics-filter">

          <button
            className={
              period === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("all")
            }
          >
            All Time
          </button>

          <button
            className={
              period === "month"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("month")
            }
          >
            This Month
          </button>

          <button
            className={
              period === "lastMonth"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("lastMonth")
            }
          >
            Last Month
          </button>

          <button
            className={
              period === "year"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("year")
            }
          >
            This Year
          </button>

        </div>

      </div>

      <div className="analytics-summary">

        <div className="analytics-summary-item">

          <span>
            Income
          </span>

          <strong>
            {formatCurrency(
              summary.income
            )}
          </strong>

        </div>

        <div className="analytics-summary-item">

          <span>
            Expenses
          </span>

          <strong>
            {formatCurrency(
              summary.expenses
            )}
          </strong>

        </div>

        <div className="analytics-summary-item">

          <span>
            Balance
          </span>

          <strong
            className={
              summary.balance < 0
                ? "negative"
                : ""
            }
          >
            {formatCurrency(
              summary.balance
            )}
          </strong>

        </div>

        <div className="analytics-summary-item">

          <span>
            Period
          </span>

          <strong>
            {getPeriodLabel()}
          </strong>

        </div>

      </div>

      <div className="analytics-chart-area">

        {analyticsData.length === 0 ? (

          <div className="analytics-empty">

            <div className="analytics-empty-icon">
              ↗
            </div>

            <h3>
              No expense data
            </h3>

            <p>
              There are no expense transactions for this period.
            </p>

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={360}
          >

            <BarChart
              data={analyticsData}
              margin={{
                top: 20,
                right: 20,
                left: 5,
                bottom: 10
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eeeeee"
              />

              <XAxis
                dataKey="category"
                tick={{
                  fill: "#777777",
                  fontSize: 11
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#999999",
                  fontSize: 10
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `Rs. ${value.toLocaleString()}`
                }
              />

              <Tooltip
                formatter={(value) => [
                  formatCurrency(value),
                  "Expenses"
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #eeeeee",
                  boxShadow:
                    "0 8px 25px rgba(0,0,0,0.08)"
                }}
              />

              <Legend />

              <Bar
                dataKey="amount"
                name="Expenses"
                fill="#222222"
                radius={[
                  6,
                  6,
                  0,
                  0
                ]}
                maxBarSize={55}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default AnalyticsChart;