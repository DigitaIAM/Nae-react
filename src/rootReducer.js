import { combineReducers } from 'redux';
import { keyboardNavigationReducer } from './components/KeyboardNavigation';
import { magazinesService } from './global/services/magazinesService';
import { metadataService } from './global/services/metadataService';

export default combineReducers({
  keyboardNavigationReducer,
  [magazinesService.reducerPath]: magazinesService.reducer,
  [metadataService.reducerPath]: metadataService.reducer,
});
