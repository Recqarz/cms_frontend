import React from "react";

const NotificationCheckbox = ({
  name,
  checked,
  onCheckboxChange,
  disabled,
}) => {
  const handleChange = () => {
    if (!disabled) {
      onCheckboxChange(!checked); // Notify parent about change if not disabled
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled} // Disable the checkbox if specified
        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <div>
        <p className="text-gray-500">{name}</p>
      </div>
    </div>
  );
};

export default NotificationCheckbox;
