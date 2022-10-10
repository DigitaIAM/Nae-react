import React, {useState} from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import './Input.scss';

const Input = ({ className, type, placeholder, col, isNavigable }) => {
  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    if (type === 'date') {
      setValue(e);
    } else {
      setValue(e.target.value);
    }
  }

  return (
    <div className={`input-wrapper col-${col} ${className}`}>
      {type === 'date' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="input"
            value={value}
            onChange={handleChange}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    "aria-navigable": isNavigable,
                  }}
                />
              )
            }}
          />
        </LocalizationProvider>
      )}

      {type === 'textarea' && (
        <textarea
          className="input"
          placeholder={placeholder}
          aria-navigable={isNavigable}
          onChange={handleChange}
        />
      )}

      {type !== 'date' && type !== 'textarea' && (
        <input
          className="input"
          type={type}
          placeholder={placeholder}
          aria-navigable={isNavigable}
          onChange={handleChange}
        />
      )}

    </div>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  col: PropTypes.number,
  isNavigable: PropTypes.bool,
};

Input.defaultProps = {
  className: null,
  type: 'text',
  placeholder: null,
  col: 12,
  isNavigable: true,
}

export default Input;