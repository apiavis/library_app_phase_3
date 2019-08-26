import { combineReducers } from 'redux';

import libraryReducer from './libraryReducer';

const rootReducer = combineReducers({
  library: libraryReducer
});

export default rootReducer;