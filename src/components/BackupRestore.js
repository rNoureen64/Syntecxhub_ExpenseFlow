import { useRef, useState } from "react";

function BackupRestore({
  transactions,
  budget,
  recurringTransactions,
  readNotificationIds,
  darkMode,
  onRestore
}) {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState(null);

  const createBackup = () => {
    const backupData = {
      app: "ExpenseFlow",
      version: "1.0",
      createdAt: new Date().toISOString(),

      data: {
        transactions,
        budget,
        recurringTransactions,
        readNotificationIds,
        darkMode,
        userName:
          localStorage.getItem(
            "expenseFlowUserName"
          ) || "Finance User"
      }
    };

    const jsonData = JSON.stringify(
      backupData,
      null,
      2
    );

    const blob = new Blob(
      [jsonData],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    const date =
      new Date()
        .toISOString()
        .split("T")[0];

    link.download =
      `ExpenseFlow_Backup_${date}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setStatus({
      type: "success",
      message:
        "Your ExpenseFlow backup has been downloaded successfully."
    });
  };

  const handleFileSelect = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".json")
    ) {
      setStatus({
        type: "error",
        message:
          "Please select a valid ExpenseFlow JSON backup file."
      });

      event.target.value = "";
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (e) => {
      try {
        const backup =
          JSON.parse(
            e.target.result
          );

        if (
          !backup ||
          backup.app !==
            "ExpenseFlow" ||
          !backup.data
        ) {
          throw new Error(
            "Invalid backup"
          );
        }

        const data =
          backup.data;

        if (
          !Array.isArray(
            data.transactions
          )
        ) {
          throw new Error(
            "Invalid transactions"
          );
        }

        if (
          !Array.isArray(
            data.recurringTransactions
          )
        ) {
          throw new Error(
            "Invalid recurring data"
          );
        }

        if (
          !Array.isArray(
            data.readNotificationIds
          )
        ) {
          throw new Error(
            "Invalid notification data"
          );
        }

        onRestore(data);

        setStatus({
          type: "success",
          message:
            "Backup restored successfully. Your ExpenseFlow data has been updated."
        });

      } catch (error) {
        console.error(
          "Backup restore error:",
          error
        );

        setStatus({
          type: "error",
          message:
            "This file is not a valid ExpenseFlow backup."
        });
      }
    };

    reader.onerror = () => {
      setStatus({
        type: "error",
        message:
          "Unable to read the selected backup file."
      });
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  return (
    <div className="backup-restore-section">

      <div className="backup-restore-header">

        <div>

          <span className="settings-eyebrow">
            BACKUP & RESTORE
          </span>

          <h2>
            Protect Your Financial Data
          </h2>

          <p>
            Download a complete backup of your
            ExpenseFlow data or restore a previous
            backup.
          </p>

        </div>

        <div className="backup-restore-icon">
          ↗
        </div>

      </div>

      <div className="backup-restore-grid">

        <div className="backup-restore-card">

          <div className="backup-card-icon">
            ↓
          </div>

          <div className="backup-card-content">

            <span>
              EXPORT
            </span>

            <h3>
              Create Backup
            </h3>

            <p>
              Save your transactions, budget,
              recurring payments, notifications
              and profile settings as a secure
              JSON backup file.
            </p>

            <button
              className="backup-primary-button"
              onClick={createBackup}
            >
              Download Backup
            </button>

          </div>

        </div>

        <div className="backup-restore-card">

          <div className="restore-card-icon">
            ↑
          </div>

          <div className="backup-card-content">

            <span>
              IMPORT
            </span>

            <h3>
              Restore Backup
            </h3>

            <p>
              Restore your ExpenseFlow data
              from a previously downloaded
              JSON backup file.
            </p>

            <button
              className="backup-secondary-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              Choose Backup File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={
                handleFileSelect
              }
              style={{
                display: "none"
              }}
            />

          </div>

        </div>

      </div>

      {status && (
        <div
          className={`backup-status ${
            status.type
          }`}
        >

          <span className="backup-status-icon">
            {status.type ===
            "success"
              ? "✓"
              : "!"}
          </span>

          <p>
            {status.message}
          </p>

          <button
            onClick={() =>
              setStatus(null)
            }
            aria-label="Close backup message"
          >
            ×
          </button>

        </div>
      )}

      <div className="backup-security-note">

        <span>
          🔒
        </span>

        <div>

          <strong>
            Your data stays in your browser
          </strong>

          <p>
            ExpenseFlow does not upload your
            backup file to a server. The backup
            is created locally on your device.
          </p>

        </div>

      </div>

    </div>
  );
}

export default BackupRestore;