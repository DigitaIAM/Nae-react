import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { setupListeners } from '@reduxjs/toolkit/query';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

import { magazinesService } from './global/services/magazinesService';
import { metadataService } from './global/services/metadataService';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(sagaMiddleware)
      .concat(magazinesService.middleware)
      .concat(metadataService.middleware),
});

setupListeners(store.dispatch);

sagaMiddleware.run(rootSaga);

export default store;
