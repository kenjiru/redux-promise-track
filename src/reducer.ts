import assign = require("object-assign");
import {
    PROMISE_TRACK_REQUEST, PROMISE_TRACK_SUCCESS, PROMISE_TRACK_FAILED, IPromiseTrackAction, IPromiseTrackPayload,
    PROMISE_TRACK_REMOVE_STATE, PROMISE_TRACK_REMOVE_STATES
} from "./actions";
import {FluxStandardAction} from "~flux-standard-action/lib/index";

export function promiseTrackReducer(state: IPromiseTrackStore = {},
                                    action: IPromiseTrackAction|FluxStandardAction): IPromiseTrackStore {
    switch (action.type) {
        case PROMISE_TRACK_REQUEST:
            return setState(state, action.payload, {
                isLoading: true,
                isSuccess: false,
                error: null
            });

        case PROMISE_TRACK_SUCCESS:
            return setState(state, action.payload, {
                isLoading: false,
                isSuccess: true,
                error: null
            });

        case PROMISE_TRACK_FAILED:
            return setState(state, action.payload, {
                isLoading: false,
                isSuccess: false,
                error: action.payload.actionError
            });

        case PROMISE_TRACK_REMOVE_STATES:
            return deleteStates(state, action.payload.actionTypes);

        case PROMISE_TRACK_REMOVE_STATE:
            return deleteState(state, action.payload.actionType, action.payload.actionId);
    }

    return state;
}

function deleteStates(state: IPromiseTrackStore, actionTypes: string[]): IPromiseTrackStore {
    state = assign({}, state);

    actionTypes.forEach((actionType: string): void => {
        delete state[actionType];
    });

    return state;
}

function deleteState(state: IPromiseTrackStore, actionType: string, actionId?: string): IPromiseTrackStore {
    state = assign({}, state);

    let actionLoadingState: IActionLoadingState = state[actionType];

    if (typeof actionLoadingState === "undefined") {
        console.log("actionLoadingState is undefined");
        return state;
    }

    if (typeof actionId === "undefined") {
        delete state[actionType];
    } else {
        if (typeof actionLoadingState.items === "undefined") {
            console.log("actionLoadingState.items is undefined");
            return state;
        }

        delete actionLoadingState.items[actionId];
    }

    return state;
}

function setState(state: IPromiseTrackStore, payload: IPromiseTrackPayload,
                  loadingState: ILoadingState): IPromiseTrackStore {
    if (typeof payload.actionId !== "undefined") {
        let actionLoadingState: IActionLoadingState = state[payload.actionType];

        if (typeof actionLoadingState === "undefined") {
            actionLoadingState = {
                items: {}
            };
        }

        actionLoadingState = assign({}, actionLoadingState, {
            items: assign({}, actionLoadingState.items, {
                [payload.actionId]: loadingState
            })
        });

        return assign({}, state, {
            [payload.actionType]: actionLoadingState
        });
    }

    return assign({}, state, {
        [payload.actionType]: assign({}, state[payload.actionType], loadingState)
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
}
