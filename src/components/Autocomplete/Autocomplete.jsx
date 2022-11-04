import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select/creatable';
import {createFakeKeyDownEvent} from '../../global/helpers';

const Autocomplete = ({ inputValue: inputPropsValue, options, onInputChange, onKeyDown }) => {
  const selectStyles = {
    container: (provided) => ({
      ...provided,
      position: 'absolute',
      left: '-1px',
      top: '-1px',
      width: 'calc(100% + 2px)',
      height: 'calc(100% + 2px)',
      zIndex: 150,
    }),
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid #317e2' : '1px solid #edeef3',
      borderRadius: 0,
      boxShadow: 'none',
      minHeight: 'unset',
      width: '100%',
      height: '100%',
    }),
    valueContainer: (provided) => ({
      ...provided,
      width: '100%',
      height: '100%',
      padding: '0 24px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      display: 'none',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 200,
    })
  }

  const [inputValue, setInputValue] = useState(inputPropsValue);
  const [autocompleteOptions, setAutocompleteOptions] = useState(options || []);

  useEffect(() => {
    if (inputValue) {
      setAutocompleteOptions(
        options.filter(({ label }) =>
          label.toLowerCase().includes(inputValue.toLowerCase())
        )
     );
    }
  }, [inputValue, options]);

  const handleChangeInput = (value) => {
    setInputValue(value);

    if (onInputChange) {
      onInputChange(value);
    }
  }

  const handleKeyDown = (e) => {
    if (e.code === 'Escape') {
      if (onKeyDown) {
        onKeyDown(e);
      }
    }
  }

  const handleSelect = (obj) => {
    if (onKeyDown) {
      onKeyDown(createFakeKeyDownEvent('Enter', false, false), obj.label);
    }
  }

  return (
    <ReactSelect
      options={autocompleteOptions}
      styles={selectStyles}
      inputValue={inputValue}
      placeholder={null}
      classNamePrefix="autocomplete"
      onInputChange={handleChangeInput}
      onChange={handleSelect}
      onKeyDown={handleKeyDown}
      tabSelectsValue={false}
      formatCreateLabel={userInput => `Ввести: ${userInput}`}
      createOptionPosition="first"
    />
  );
};

Autocomplete.propTypes = {
  inputValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  onInputChange: PropTypes.func,
  onKeyDown: PropTypes.func,
};

Autocomplete.defaultProps = {
  inputValue: '',
  options: [],
  onInputChange: null,
  onKeyDown: null,
};

export default Autocomplete;