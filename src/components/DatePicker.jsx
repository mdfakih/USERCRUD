import React from 'react';
import '../styles/DatePicker.css'; // CSS file

const DatePicker = ({ value, onChange }) => {
  return (
    <div className="date-picker-wrapper">
      <label htmlFor="date-input">Select Date:</label>
      <input
        id="date-input"
        type="date"
        value={value}
        onChange={onChange}
        className="date-input"
      />
    </div>
  );
};

export default DatePicker;
