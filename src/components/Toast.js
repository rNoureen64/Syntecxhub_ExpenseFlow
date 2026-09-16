function Toast({ message, type = "success", onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </div>

      <div className="toast-content">
        <strong>{type === "success" ? "Success" : "Attention"}</strong>
        <p>{message}</p>
      </div>

      <button onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;