import { createAction } from '@reduxjs/toolkit';
import * as constants from './constants';

export const setCurrentActiveNavigableElementIndex = createAction(constants.SET_CURRENT_ACTIVE_NAVIGABLE_ELEMENT_INDEX);
export const resetCurrentActiveNavigableElementIndex = createAction(constants.RESET_CURRENT_ACTIVE_NAVIGABLE_ELEMENT_INDEX);
