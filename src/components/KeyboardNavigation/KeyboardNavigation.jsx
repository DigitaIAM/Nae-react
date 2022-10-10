import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {selectors} from './reducer';
import * as actions from './actions';
import {getFocusableElements} from '../../global/helpers';

const KeyboardNavigation = ({ children, gridRef }) => {
  const containerRef = useRef();

  const dispatch = useDispatch();

  const currentActiveNavigableElementIndex = useSelector(selectors.currentActiveNavigableElementIndexSelector);

  useEffect(() => {
    const handleChangeFocusedOnPressEnter = (e) => {
      if (e.key === 'Enter') {
        if (document.activeElement) {
          const focusable = getFocusableElements();

          const isNavigable = document.activeElement.getAttribute('aria-navigable');
          const isHaveClassName = document.activeElement.classList.contains('MuiIconButton-edgeEnd');

          if (isNavigable !== 'false' || Boolean(isHaveClassName)) {
            const index = focusable.indexOf(document.activeElement);

            if (index > -1 && focusable[index + 1]) {
              dispatch(actions.setCurrentActiveNavigableElementIndex(index + 1));
            }
          }
        }
      }
    }

    if (containerRef.current) {
      document.addEventListener('keydown', handleChangeFocusedOnPressEnter);
    }

    return () => {
      if (containerRef.current) {
        document.removeEventListener('keydown', handleChangeFocusedOnPressEnter);
      }
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (currentActiveNavigableElementIndex || currentActiveNavigableElementIndex > -1) {
      const focusable = getFocusableElements();

      if (focusable[currentActiveNavigableElementIndex]) {
        focusable[currentActiveNavigableElementIndex].focus();
      }
    }

    return () => {
      dispatch(actions.resetCurrentActiveNavigableElementIndex());
    }
  }, [currentActiveNavigableElementIndex])

  return (
    <div ref={containerRef} className="keyboard-navigation--wrapper">
      {children}
    </div>
  );
};

KeyboardNavigation.propTypes = {

};

export default KeyboardNavigation;