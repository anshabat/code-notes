import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = (immutableState: CellsState = initialState, action: Action) => {
  return produce(immutableState, (state) => {
    switch (action.type) {
      case ActionType.FETCH_CELLS:
        state.error = null;
        state.loading = true;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.loading = false;
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState['data']);
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.error = action.payload;
        state.loading = false;
        return state;
      case ActionType.MOVE_CELL:
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex =
          action.payload.direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1) return;
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        return;
      case ActionType.DELETE_CELL:
        delete state.data[action.payload.id];
        state.order = state.order.filter((id) => id !== action.payload.id);
        return;
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: '',
        };
        state.data[cell.id] = cell;
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );
        if (foundIndex === -1) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(foundIndex + 1, 0, cell.id);
        }
        return;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return;
      default:
        return;
    }
  });
};

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export default reducer;
