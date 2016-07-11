import { isFSA } from "flux-standard-action";
import assign from "object-assign";
import { Promise } from "es6-promise";
import { promiseAsyncRequest, promiseAsyncSucceeded, promiseAsyncFailed } from "./actions"

function isPromise(val) {
    return val && typeof val.then === "function";
}

export function promiseMiddleware({ dispatch }) {
    return (next) => (action) => {
        if (!isFSA(action)) {
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