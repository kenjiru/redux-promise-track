import assign from "object-assign";
import {PROMISE_TRACK_REQUEST, PROMISE_TRACK_SUCCESS, PROMISE_TRACK_FAILED, IPromiseTrackAction, IPromiseTrackPayload} from "./actions";

export function promiseTrackReducer(state: IPromiseTrackStore = {}, action: IPromiseTrackAction): IPromiseTrackStore {
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
    }

    return state;
}

function setState(state: IPromiseTrackStore, payload: IPromiseTrackPayload, loadingState: ILoadingState): IPromiseTrackStore {
    if (typeof payload.actionId !== "undefined") {
        let actionLoadingState: IActionLoadingState = state[payload.actionType];

        if (typeof actionLoadingState === "undefined") {
            state[payload.actionType] = {
                items: {}
            } as IActionLoadingState;
        }

        actionLoadingState = assign({}, actionLoadingState, {
            [payload.actionId]: loadingState
        });

        return assign({}, state, {
            [payload.actionType]: actionLoadingState
        });
    }

    return assign({}, state, {
        [payload.actionType]: loadingState
    });
}

interface IPromiseTrackStore {
    [actionType: string]: IActionLoadingState;
}

interface IActionLoadingState extends ILoadingState {
    items?: {
        [actionId: string]: ILoadingState;
    }
}

interface ILoadingState {
    isLoading?: boolean;
    isSuccess?: boolean;
    error?: any;
}
