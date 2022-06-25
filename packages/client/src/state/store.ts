import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ActionType } from './action-types';
import { persistMiddleware } from './middlewares/persist-middleware';
import reducers from './reducers';

export const store = createStore(
  reducers,
  {},
  applyMiddleware(thunk, persistMiddleware)
);

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: 'code',
  },
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: 'text',
  },
});
