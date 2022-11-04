import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import config from '../../config';

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

  const handleAcceptDateChange = () => {
    const focusableElements = config.shortcuts.document.focusableElementsByEnter;

    const focusable = Array.prototype.filter.call(document.body.querySelectorAll(focusableElements), (element) => element.offsetWidth > 0 || element.offsetHeight || document.activeElement === element);
    const activeIndex = document.activeElement ? focusable.indexOf(document.activeElement) : 0;

    const direction = 1;

    if ((activeIndex + direction > -1) || (activeIndex + direction < focusable.length)) {
      const nextElement = focusable[activeIndex + direction];

      if (nextElement.classList.contains('table--scroll-container-wrapper')) {
        const rowsArray = Array.from(nextElement.children || []);

        const firstRow = rowsArray[0];

        firstRow.focus();
        return;
      }

      nextElement.focus();
    }
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
            onAccept={handleAcceptDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  placeholder: null,
};

export default Input;