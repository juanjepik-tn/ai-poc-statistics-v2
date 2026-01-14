import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import notificationReducer from './slices/notification';
import spinnerReducer from './slices/spinner';
import storeReducer from './slices/store';
import sessionReducer from './slices/session';
import billingReducer from './slices/billing';
import metaIssuesAlertReducer from './slices/metaIssue';
import tagsReducer from './slices/tags';
import channelsReducer from './slices/channels';
// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const rootReducer = combineReducers({  
  notification: notificationReducer,
  spinner: spinnerReducer,
  store: storeReducer,
  session: sessionReducer,
  billing: billingReducer,
  metaIssuesAlert: metaIssuesAlertReducer,
  tags: tagsReducer,
  channels: channelsReducer,
});
