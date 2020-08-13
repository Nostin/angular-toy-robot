import { createAction, props } from '@ngrx/store';
import type { CommandHistoryEntryType, TableStateType } from '../globalTypes';

export const addCommandRecord = createAction('[Command History] Add', props<{ command: CommandHistoryEntryType }>());
export const resetTableTop = createAction('[Table Top] Reset');
export const updateTableTop = createAction('[Table Top] Update', props<{ newTableState: TableStateType }>());
