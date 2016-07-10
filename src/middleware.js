import { isFSA } from "flux-standard-action";
import { promiseAsyncRequest, promiseAsyncSuccedded, promiseAsyncFailed } from "./actions.js"

function isPromise(val) {
    return val && typeof val.then === "function";
}

export default function promiseMiddleware({ dispatch }) {
    return next => action => {
        if (!isFSA(action)) {
            return isPromise(action) ? action.then(dispatch) : next(action);
        }

        if(isPromise(action.payload)) {
            dispatch(promiseAsyncRequest(action.type));

            return action.payload.then(
                result => {
                    dispatch(promiseAsyncSuccedded(action.type));
                    
                    return dispatch({ ...action, payload: result });
                },
                error => {
                    dispatch(promiseAsyncFailed(action.type, error));
                    dispatch({ ...action, payload: error, error: true });

                    return Promise.reject(error);
                }
            )
        }

        return next(action);
    };
}