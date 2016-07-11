export const PROMISE_ASYNC_REQUEST = "PROMISE_ASYNC_REQUEST";
export const PROMISE_ASYNC_SUCCESS = "PROMISE_ASYNC_SUCCESS";
export const PROMISE_ASYNC_FAILED = "PROMISE_ASYNC_FAILED";

export let promiseAsyncRequest = (actionType) => ({
    type: PROMISE_ASYNC_REQUEST,
    payload: {
        actionType
    }
});

export let promiseAsyncSucceeded = (actionType) => ({
    type: PROMISE_ASYNC_SUCCESS,
    payload: {
        actionType
    }
});

export let promiseAsyncFailed = (actionType, actionError) => ({
    type: PROMISE_ASYNC_FAILED,
    payload: {
        actionType,
        actionError
    }
});
