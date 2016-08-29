import { FluxStandardAction } from "flux-standard-action";
import {isEmpty} from "./util";

export const PROMISE_TRACK_REQUEST = "PROMISE_TRACK_REQUEST";
export const PROMISE_TRACK_SUCCESS = "PROMISE_TRACK_SUCCESS";
export const PROMISE_TRACK_FAILED = "PROMISE_TRACK_FAILED";
export const PROMISE_TRACK_REMOVE_STATES = "PROMISE_TRACK_REMOVE_STATES";
export const PROMISE_TRACK_REMOVE_STATE = "PROMISE_TRACK_REMOVE_STATE";

export function promiseTrackRequest(action: FluxStandardAction): IPromiseTrackAction {
    return createAction(PROMISE_TRACK_REQUEST, action);
}

export function promiseTrackSucceeded(action: FluxStandardAction): IPromiseTrackAction {
    return createAction(PROMISE_TRACK_SUCCESS, action);
}

export function promiseTrackFailed(action: FluxStandardAction, actionError: any): IPromiseTrackAction {
    return createAction(PROMISE_TRACK_FAILED, action, actionError);
}

export function removeLoadingState(actionType: string, actionId?: string|string[]): FluxStandardAction {
    let actionIds: string[];

    if (actionId instanceof Array) {
        actionIds = actionId;
    } else {
        if (typeof actionId !== "undefined") {
            actionIds = [actionId];
        }
    }

    return {
        type: PROMISE_TRACK_REMOVE_STATE,
        payload: {
            actionType,
            actionIds
        }
    };
}

export function removeLoadingStates(actionTypes: string[]): FluxStandardAction {
    return {
        type: PROMISE_TRACK_REMOVE_STATES,
        payload: {
            actionTypes
        }
    };
}

function createAction(type: string, originalAction: FluxStandardAction, error?: any): IPromiseTrackAction {
    let asyncAction: IPromiseTrackAction = {
        type,
        payload: {
            actionType: originalAction.type
        }
    };

    let meta: any = Object.assign({}, originalAction.meta);

    if (typeof meta === "object") {
        if (typeof meta.actionId !== "undefined") {
            delete meta.actionId;
        }

        if (isEmpty(meta) === false) {

            asyncAction.meta = meta;
        }
    }

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
