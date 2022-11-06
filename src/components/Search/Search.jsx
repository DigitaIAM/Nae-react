import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { HiChevronDown } from 'react-icons/hi';
import { AiOutlineEnter } from 'react-icons/ai';
import './Search.scss';

const Search = ({ suggestions, baseUrl, placeholder, focusKey }) => {
  const navigate = useNavigate();

  const inputRef = useRef();

  const [value, setValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(0);

  const onChange = (e) => {
    const inputValue = e.target.value;

    const fs = suggestions.filter((suggestion) => suggestion.value.toLowerCase().indexOf(inputValue.toLocaleString()) > -1);

    setFilteredSuggestions(fs);
    setValue(inputValue);
    setSelectedSuggestionId(0);
  }

  const onFocus = () => {
    setIsFocused(true);
  }

  const onBlur = () => {
    setIsFocused(false);
  }

  const handleInputKeyDown = (e) => {
    if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();

      const direction = e.code === 'ArrowDown' ? 1 : -1;

      const isPossible = selectedSuggestionId + direction < filteredSuggestions.length + 1 && selectedSuggestionId + direction > -1;

      if (isPossible) {
        setSelectedSuggestionId((prev) => prev + direction);
      }
    }

    if (e.code === 'Enter') {
      if (selectedSuggestionId === 0) {
        // URL CHANGE NEEDED
        navigate(`${baseUrl}/`);
      } else {
        const searchItem = filteredSuggestions.find((item) => item.id === selectedSuggestionId);

        navigate(`${baseUrl}/${searchItem.url}`);
      }
    }
  }

  const handleNavigateOnClick = (url) => {
    navigate(`${baseUrl}/${url}`);
  }

  useEffect(() => {
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

    document.addEventListener('keydown', handleFocusOnKeyDown);

    return () => {
      document.removeEventListener('keydown', handleFocusOnKeyDown);
    }
  }, [focusKey]);

  return (
    <div className="search-wrapper">
      <div className={`search-input--wrapper ${isFocused ? 'focused' : ''}`}>
        <input
          ref={inputRef}
          tabIndex={0}
          className="search-input"
          type="text"
          value={value}
          placeholder={placeholder}
          onKeyDown={handleInputKeyDown}
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
      {isFocused ? (
        <div className="search--suggestions-wrapper">
          <ul className="suggestions-list">
            <li className="suggestions-item">
              <div
                className={`suggestions-item__link ${selectedSuggestionId === 0 ? 'active' : ''}`}
                // URL CHANGE NEEDED
                onClick={() => handleNavigateOnClick('')}
              >
                <span className="link__text">
                  {value?.length ? value : 'Search throw all documents...'}
                </span>
                <span className="link__control-icon">
                  <AiOutlineEnter />
                </span>
              </div>
            </li>
            {filteredSuggestions.map((s, index) => (
              <li
                key={s.id}
                className="suggestions-item"
              >
                <div
                  className={`suggestions-item__link ${selectedSuggestionId === index + 1 ? 'active' : ''}`}
                  onClick={() => handleNavigateOnClick(s.url)}
                >
                  <span className="link__text">{s.value}</span>
                  <span className="link__control-icon">
                    <AiOutlineEnter />
                  </span>
                </div>
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
  placeholder: PropTypes.string,
  focusKey: PropTypes.string,
};

Search.defaultProps = {
  focusKey: '/',
  placeholder: null,
};

export default Search;