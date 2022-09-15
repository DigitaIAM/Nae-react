import { combineReducers } from 'redux';
import { magazinesService } from './global/services/magazinesService';

export default combineReducers({
  [magazinesService.reducerPath]: magazinesService.reducer,
});
