import { createReducer } from '@reduxjs/toolkit';
import * as actions from './actions';

const initialState = {
  activeNavigableIndex: 0,
};

const reducer = createReducer(initialState, {
  [actions.setCurrentActiveNavigableElementIndex]: (state, action) => {
    state.activeNavigableIndex = action.payload;
  },
  [actions.resetCurrentActiveNavigableElementIndex]: (state) => {
    state.activeNavigableIndex = 0;
  },
});

const currentActiveNavigableElementIndexSelector = (state) => state.keyboardNavigationReducer.activeNavigableIndex;

const selectors = {
  currentActiveNavigableElementIndexSelector,
};

export { reducer, initialState, selectors };
export default reducer;
