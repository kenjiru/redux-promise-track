import { isFSA } from "flux-standard-action";
import assign from "object-assign";
import { Promise } from "es6-promise";
import { promiseAsyncRequest, promiseAsyncSucceeded, promiseAsyncFailed } from "./actions"
import {FluxStandardAction} from "~flux-standard-action/lib/index";

export function promiseMiddleware({ dispatch }) {
    return (next) => (action) => {
        if (!isActionFSA(action)) {
            return isPromise(action) ? action.then(dispatch) : next(action);
        }

        if(isPromise(action.payload)) {
            dispatch(promiseAsyncRequest(action.type));

            return action.payload.then(
                result => {
                    dispatch(promiseAsyncSucceeded(action.type));

                    return dispatch(assign({}, action, { payload: result }));
                },
                error => {
                    dispatch(promiseAsyncFailed(action.type, error));
                    dispatch(assign({}, action, { payload: error, error: true }));

                    return Promise.reject(error);
                }
            );
        }

        return next(action);
    };
}

function isPromise(value: any): value is Promise<any> {
    return value && typeof value.then === "function";
}

function isActionFSA(value: any): value is FluxStandardAction {
    return isFSA(value);
}
