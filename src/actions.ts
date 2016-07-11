import { FluxStandardAction } from "flux-standard-action";

export const PROMISE_TRACK_REQUEST = "PROMISE_TRACK_REQUEST";
export const PROMISE_TRACK_SUCCESS = "PROMISE_TRACK_SUCCESS";
export const PROMISE_TRACK_FAILED = "PROMISE_TRACK_FAILED";

export function promiseTrackRequest(action: FluxStandardAction): IPromiseTrackAction {
    let asyncAction: IPromiseTrackAction = {
        type: PROMISE_TRACK_REQUEST,
        payload: {
            actionType: action.type
        }
    };

    if (action.meta && action.meta.actionId) {
        asyncAction.payload.actionId = action.meta.actionId;
    }

    return asyncAction;
}

export function promiseTrackSucceeded(action: FluxStandardAction): IPromiseTrackAction {
    let asyncAction: IPromiseTrackAction = {
        type: PROMISE_TRACK_SUCCESS,
        payload: {
            actionType: action.type
        }
    };

    if (action.meta && action.meta.actionId) {
        asyncAction.payload.actionId = action.meta.actionId;
    }

    return asyncAction;
}

export function promiseTrackFailed(action: FluxStandardAction, actionError: any): IPromiseTrackAction {
    let asyncAction: IPromiseTrackAction = {
        type: PROMISE_TRACK_FAILED,
        payload: {
            actionType: action.type,
            actionError
        }
    };

    if (action.meta && action.meta.actionId) {
        asyncAction.payload.actionId = action.meta.actionId;
    }

    return asyncAction;
}

export interface IPromiseTrackAction extends FluxStandardAction {
    payload?: IPromiseTrackPayload;
}

export interface IPromiseTrackPayload {
    actionType?: string|symbol;
    actionId?: string;
    actionError?: any;
}
