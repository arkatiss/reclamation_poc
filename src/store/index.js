import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import {
  persistReducer,   
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'   
 // or 'redux-persist/lib/storage/session' for sessionStorage
import division from '../slices/division'
import { api } from '../services/api';
import navigation from '../slices/navigation'
import upload from '../slices/upload';
import user from '../slices/user';
import additionalFilters from '../slices/filters';

import columnSelection from '../slices/columnSelection'
const reducers = combineReducers({
  navigation,
  division,
  upload,
  columnSelection,
  user,
  additionalFilters,
  api: api.reducer,
});

const persistConfig = {
  key: 'root',
  storage, // or sessionStorage
  whitelist: ['theme'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware:   
 (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],   

      },
    }).concat(api.middleware),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor   };