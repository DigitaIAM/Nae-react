import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { HiChevronDown } from 'react-icons/hi';
import { AiOutlineEnter, AiOutlineSearch } from 'react-icons/ai';
import './Search.scss';

const Search = ({ suggestions, baseUrl, placeholder, focusKey }) => {
  const inputRef = useRef();

  const [value, setValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(-1);

  const onChange = (e) => {
    const inputValue = e.target.value;

    const filteredSuggestions = suggestions.filter((suggestion) => suggestion.value.toLowerCase().indexOf(inputValue.toLocaleString()) > -1);

    setFilteredSuggestions(filteredSuggestions);
    setValue(inputValue);
  }

  const onFocus = () => {
    setIsFocused(true);
  }

  const onBlur = () => {
    setIsFocused(false);
  }

  const handleFocusOnKeyDown = (e) => {
    if (e.key === focusKey) {
      if (inputRef.current) {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          inputRef.current.focus();
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleFocusOnKeyDown);

    return () => {
      document.removeEventListener('keydown', handleFocusOnKeyDown);
    }
  }, []);

  return (
    <div className="search-wrapper">
      <div className="search-input--wrapper">
        <input
          ref={inputRef}
          tabIndex={0}
          className="search-input"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <div className="search-input--icons">
          <div className="focus-button-icon">
            <span>{focusKey}</span>
          </div>
          <HiChevronDown />
        </div>
      </div>
      {false ? (
        <div className="search--suggestions-wrapper">
          <ul className="suggestions-list">
            <li className="suggestions-item">
              <Link
                to="/"
                className="suggestions-item__link"
              >
                <span className="link__text">
                  {value}
                </span>
                <span className="link__control-icon">
                  <AiOutlineEnter />
                </span>
              </Link>
            </li>
            {filteredSuggestions.map((s) => (
              <li className="suggestions-item">
                <Link
                  to={`${baseUrl}/${s.id}`}
                  className="suggestions-item__link"
                >
                  <span className="link__text">{s.value}</span>
                  <span className="link__control-icon">
                    <AiOutlineEnter />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

Search.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  baseUrl: PropTypes.string.isRequired,
  focusKey: PropTypes.string,
};

Search.defaultProps = {
  focusKey: '/',
};

export default Search;