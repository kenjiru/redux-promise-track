import { isFSA } from "flux-standard-action";
import * as assign from "object-assign";
import { Promise } from "es6-promise";
import { promiseTrackRequest, promiseTrackSucceeded, promiseTrackFailed } from "./actions"
import { FluxStandardAction } from "flux-standard-action";

export function promiseTrackMiddleware({ dispatch }) {
    return (next) => (action) => {
        if (!isActionFSA(action)) {
            return isPromise(action) ? action.then(dispatch) : next(action);
        }

        if(isPromise(action.payload)) {
            dispatch(promiseTrackRequest(action));

            return action.payload.then(
                result => {
                    dispatch(promiseTrackSucceeded(action));

                    return dispatch(assign({}, action, { payload: result }));
                },
                error => {
                    dispatch(promiseTrackFailed(action, error));
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
