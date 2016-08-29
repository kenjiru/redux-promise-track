import {
    PROMISE_TRACK_REQUEST, PROMISE_TRACK_SUCCESS, PROMISE_TRACK_FAILED, IPromiseTrackAction, IPromiseTrackPayload,
    PROMISE_TRACK_REMOVE_STATE, PROMISE_TRACK_REMOVE_STATES
} from "./actions";
import {FluxStandardAction} from "~flux-standard-action/lib/index";
import {isEmpty} from "./util";

export function promiseTrackReducer(state: IPromiseTrackStore = {},
                                    action: IPromiseTrackAction|FluxStandardAction): IPromiseTrackStore {
    switch (action.type) {
        case PROMISE_TRACK_REQUEST:
            return setState(state, action as IPromiseTrackAction, {
                isLoading: true,
                isSuccess: false,
                error: null
            });

        case PROMISE_TRACK_SUCCESS:
            return setState(state, action as IPromiseTrackAction, {
                isLoading: false,
                isSuccess: true,
                error: null
            });

        case PROMISE_TRACK_FAILED:
            return setState(state, action as IPromiseTrackAction, {
                isLoading: false,
                isSuccess: false,
                error: action.payload.actionError
            });

        case PROMISE_TRACK_REMOVE_STATES:
            return removeStates(state, action.payload.actionTypes);

        case PROMISE_TRACK_REMOVE_STATE:
            return removeState(state, action.payload.actionType, action.payload.actionIds);
    }

    return state;
}

function removeStates(state: IPromiseTrackStore, actionTypes: string[]): IPromiseTrackStore {
    state = Object.assign({}, state);

    actionTypes.forEach((actionType: string): void => {
        delete state[actionType];
    });

    return state;
}

function removeState(state: IPromiseTrackStore, actionType: string, actionIds?: string[]): IPromiseTrackStore {
    state = Object.assign({}, state);

    let actionLoadingState: IActionLoadingState = state[actionType];

    if (typeof actionLoadingState === "undefined") {
        return state;
    }

    if (typeof actionIds === "undefined") {
        delete state[actionType];
    } else {
        if (typeof actionLoadingState.items === "undefined") {
            return state;
        }

        actionIds.forEach((actionId: string): void => {
            delete actionLoadingState.items[actionId];
        });
    }

    return state;
}

function setState(state: IPromiseTrackStore, action: IPromiseTrackAction,
                  loadingState: ILoadingState): IPromiseTrackStore {
    let payload: IPromiseTrackPayload = action.payload;
    let meta: any = action.meta;

    if (typeof meta === "object") {
        if (typeof meta.actionId !== "undefined") {
            delete meta.actionId;
        }

        if (isEmpty(meta) === false) {

            loadingState.meta = meta;
        }
    }

    if (typeof payload.actionId !== "undefined") {
        let actionLoadingState: IActionLoadingState = state[payload.actionType];

        if (typeof actionLoadingState === "undefined") {
            actionLoadingState = {
                items: {}
            };
        }

        actionLoadingState = Object.assign({}, actionLoadingState, {
            items: Object.assign({}, actionLoadingState.items, {
                [payload.actionId]: loadingState
            })
        });

        return Object.assign({}, state, {
            [payload.actionType]: actionLoadingState
        });
    }

    return Object.assign({}, state, {
        [payload.actionType]: Object.assign({}, state[payload.actionType], loadingState)
    });
}

export interface IPromiseTrackStore {
    [actionType: string]: IActionLoadingState;
}

export interface IActionLoadingState extends ILoadingState {
    items?: {
        [actionId: string]: ILoadingState;
    }
}

export interface ILoadingState {
    isLoading?: boolean;
    isSuccess?: boolean;
    error?: any;
    meta?: any;
}
