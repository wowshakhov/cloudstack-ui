import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';
import { DateObject } from '../models/date-object.model';
import moment = require('moment');
import { Utils } from '../../shared/services/utils/utils.service';

export interface VmLogsFilters {
  search: string;
  startDate: DateObject;
  endDate: DateObject;
  selectedLogFile: string;
  newestFirst: boolean;
}

export interface State extends EntityState<VmLog> {
  loading: boolean;
  filters: VmLogsFilters;
  uiPage: number;
}

export interface VmLogsState {
  list: State;
}

export const vmLogsReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<VmLog> = createEntityAdapter<VmLog>({
  selectId: vmLog => vmLog.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  uiPage: 1,
  filters: {
    selectedLogFile: null,
    search: null,
    startDate: moment()
      .add(-1, 'days')
      .set({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
      .toObject(),
    endDate: moment()
      .set({
        hours: 23,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      })
      .toObject(),
    newestFirst: false,
  },
});

export function reducer(state = initialState, action: vmLogsActions.Actions): State {
  switch (action.type) {
    case vmLogsActions.VmLogsActionTypes.ENABLE_AUTO_UPDATE:
    case vmLogsActions.VmLogsActionTypes.DISABLE_AUTO_UPDATE: {
      return adapter.removeAll(state);
    }

    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_REQUEST: {
      return {
        ...adapter.removeAll(state),
        loading: true,
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_SEARCH: {
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE:
    case vmLogsActions.VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE_TIME: {
      return {
        ...state,
        filters: {
          ...state.filters,
          startDate: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE: {
      const { years, months, date } = moment(action.payload).toObject();

      return {
        ...state,
        filters: {
          ...state.filters,
          startDate: {
            ...state.filters.startDate,
            years,
            months,
            date,
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_TIME: {
      // todo: remove
      if (
        action.payload.hour === state.filters.startDate.hours &&
        action.payload.minute === state.filters.startDate.minutes
      ) {
        return state;
      }

      const { hour, minute } = Utils.convertAmPmTo24(action.payload);

      return {
        ...state,
        filters: {
          ...state.filters,
          startDate: {
            ...state.filters.startDate,
            hours: hour,
            minutes: minute,
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE_TIME: {
      return {
        ...state,
        filters: {
          ...state.filters,
          endDate: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE: {
      const { years, months, date } = moment(action.payload).toObject();

      return {
        ...state,
        filters: {
          ...state.filters,
          endDate: {
            ...state.filters.endDate,
            years,
            months,
            date,
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_TIME: {
      // todo: remove
      if (
        action.payload.hour === state.filters.endDate.hours &&
        action.payload.minute === state.filters.endDate.minutes
      ) {
        return state;
      }

      const { hour, minute } = Utils.convertAmPmTo24(action.payload);

      return {
        ...state,
        filters: {
          ...state.filters,
          endDate: {
            ...state.filters.endDate,
            hours: hour,
            minutes: minute,
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_LOG_FILE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedLogFile: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST: {
      return {
        ...state,
        filters: {
          ...state.filters,
          newestFirst: !state.filters.newestFirst,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_NEWEST_FIRST: {
      return {
        ...state,
        filters: {
          ...state.filters,
          newestFirst: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.SCROLL_VM_LOGS: {
      return {
        ...state,
        uiPage: state.uiPage + 1,
      };
    }

    case vmLogsActions.VmLogsActionTypes.RESET_VM_LOGS_SCROLL: {
      return {
        ...state,
        uiPage: 1,
      };
    }

    default: {
      return state;
    }
  }
}

export const getVmLogsState = createFeatureSelector<VmLogsState>('vmLogs');

export const getVmLogsEntitiesState = createSelector(getVmLogsState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getVmLogsEntitiesState,
);

export const isLoading = createSelector(getVmLogsEntitiesState, state => state.loading);

export const filters = createSelector(getVmLogsEntitiesState, state => state.filters);

export const filterSearch = createSelector(filters, state => state.search);

export const filterStartDate = createSelector(filters, state => state.startDate);

export const filterStartTime = createSelector(filters, state => ({
  hour: state.startDate.hours,
  minute: state.startDate.minutes,
}));

export const filterEndDate = createSelector(filters, state => state.endDate);

export const filterEndTime = createSelector(filters, state => ({
  hour: state.endDate.hours,
  minute: state.endDate.minutes,
}));

export const filterNewestFirst = createSelector(filters, state => state.newestFirst);

export const filterSelectedLogFile = createSelector(filters, state => state.selectedLogFile);

export const selectUiPage = createSelector(getVmLogsEntitiesState, state => state.uiPage);

const uiPageSize = 100;

export const selectScrolledLogs = createSelector(selectAll, selectUiPage, (logs, uiPage) =>
  logs.slice(0, uiPage * uiPageSize),
);

export const selectAreAllLogsShown = createSelector(
  selectTotal,
  selectUiPage,
  (total, uiPage) => uiPage * uiPageSize >= total,
);
