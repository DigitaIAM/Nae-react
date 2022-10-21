import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import './Input.scss';

const Input = ({ type, placeholder }) => {
  const [datetimeValue, setDatetimeValue] = useState(null);
  const [value, setValue] = useState('');

  const handleChangeInput = (e) => {
    setValue(e.target.value);
  }

  const handleChangeDateInput = (newValue) => {
    setDatetimeValue(newValue);
  }

  return (
    <div
      className="input-wrapper"
    >
      {(type === 'text' || type === 'number') && (
        <input
          tabIndex={0}
          className="input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChangeInput}
        />
      )}
      {type === 'date' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            tabIndex={0}
            inputFormat="MM/DD/YYYY"
            value={datetimeValue}
            onChange={handleChangeDateInput}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      )}
    </div>
  );
};

Input.propTypes = {

};

export default Input;