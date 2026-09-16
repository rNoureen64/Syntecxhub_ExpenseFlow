
import { useEffect, useState } from "react";

function UserProfile() {
  const [name, setName] = useState(() => {
    return localStorage.getItem("expenseFlowUserName") || "Finance User";
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState(name);

  useEffect(() => {
    localStorage.setItem(
      "expenseFlowUserName",
      name
    );
  }, [name]);

  const handleSave = () => {
    const cleanedName = inputName.trim();

    if (!cleanedName) {
      return;
    }

    setName(cleanedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputName(name);
    setIsEditing(false);
  };

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  );

  const hour = currentDate.getHours();

  let greeting = "Good morning";

  if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon";
  } else if (hour >= 18) {
    greeting = "Good evening";
  }

  const firstLetter =
    name.charAt(0).toUpperCase();

  return (
    <div className="user-profile-section">

      <div className="user-profile-content">

        <div className="user-profile-text">

          <span className="user-profile-eyebrow">
            {formattedDate}
          </span>

          <h2>
            {greeting}, {name.split(" ")[0]} 👋
          </h2>

          <p>
            Here's your financial overview for today.
          </p>

        </div>

        <div className="user-profile-actions">

          <div className="user-avatar">
            {firstLetter}
          </div>

          {!isEditing ? (

            <button
              className="profile-edit-button"
              onClick={() => {
                setInputName(name);
                setIsEditing(true);
              }}
            >
              Edit Profile
            </button>

          ) : (

            <div className="profile-edit-area">

              <input
                type="text"
                value={inputName}
                onChange={(e) =>
                  setInputName(e.target.value)
                }
                placeholder="Enter your name"
                maxLength="30"
              />

              <button
                className="profile-save-button"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="profile-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          )}

        </div>

      </div>

      <div className="profile-status">

        <span className="profile-status-dot">
        </span>

        <span>
          Personal finance workspace
        </span>

      </div>

    </div>
  );
}

export default UserProfile;
