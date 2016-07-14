import { FluxStandardAction } from "flux-standard-action";

export const PROMISE_TRACK_REQUEST = "PROMISE_TRACK_REQUEST";
export const PROMISE_TRACK_SUCCESS = "PROMISE_TRACK_SUCCESS";
export const PROMISE_TRACK_FAILED = "PROMISE_TRACK_FAILED";

export function promiseTrackRequest(action: FluxStandardAction): IPromiseTrackAction {
    return createAction(PROMISE_TRACK_REQUEST, action);
}

export function promiseTrackSucceeded(action: FluxStandardAction): IPromiseTrackAction {
    return createAction(PROMISE_TRACK_SUCCESS, action);
}

export function promiseTrackFailed(action: FluxStandardAction, actionError: any): IPromiseTrackAction {
    return createAction(PROMISE_TRACK_FAILED, action, actionError);
}

function createAction(type: string, originalAction: FluxStandardAction, error?: any): IPromiseTrackAction {
    let asyncAction: IPromiseTrackAction = {
        type,
        payload: {
            actionType: originalAction.type
        }
    };

    if (error) {
        asyncAction.payload.actionError = error;
    }

    if (originalAction.meta && originalAction.meta.actionId) {
        asyncAction.payload.actionId = originalAction.meta.actionId;
    }

    return asyncAction;
}

export interface IPromiseTrackAction extends FluxStandardAction {
    payload: IPromiseTrackPayload;
}

export interface IPromiseTrackPayload {
    actionType: string|symbol;
    actionId?: string;
    actionError?: any;
}
