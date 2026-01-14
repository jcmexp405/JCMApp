import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from '../reducers/rootReducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

const persistConfig = {
  key: 'root',
  storage,
  serialize: !isNative,
  deserialize: !isNative
};

const persistedReducer = isNative ? rootReducer : persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));

export const persistor = persistStore(store);
