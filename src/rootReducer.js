import { combineReducers } from 'redux';
import { keyboardNavigationReducer } from './components/KeyboardNavigation';
import { magazinesService } from './global/services/magazinesService';

export default combineReducers({
  keyboardNavigationReducer,
  [magazinesService.reducerPath]: magazinesService.reducer,
});
