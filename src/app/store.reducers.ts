import { createReducer, on } from '@ngrx/store';
import type { Action } from '@ngrx/store';
import { addCommandRecord, resetTableTop, updateTableTop } from './store.actions';
import type { CommandHistoryEntryType, TableStateType } from '../globalTypes';

export const initialCommandHistoryState: CommandHistoryEntryType[] = [];

export const initialTableTopState: TableStateType = {
  gridSize: 5,
  robotIsPlaced: false,
};

const createCommandHistoryReducer = createReducer(
  initialCommandHistoryState,
  on(addCommandRecord, (state, { command }) => [...state, command])
);

const createTableTopReducer = createReducer(
  initialTableTopState,
  on(resetTableTop, (state) => initialTableTopState),
  on(updateTableTop, (state, { newTableState }) => newTableState)
);

export function commandHistoryReducer(state: CommandHistoryEntryType[], action: Action): any {
  return createCommandHistoryReducer(state, action);
}

export function tableTopReducer(state: TableStateType, action: Action): any {
  return createTableTopReducer(state, action);
}
