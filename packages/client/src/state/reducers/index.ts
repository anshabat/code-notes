import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';

export type RootState = ReturnType<typeof reducer>;

const reducer = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducer;
