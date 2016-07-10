import { PROMISE_ASYNC_REQUEST, PROMISE_ASYNC_SUCCESS, PROMISE_ASYNC_FAILED } from "./actions";

export default function promiseReducer(state, action) {
    switch (action.type) {
        case PROMISE_ASYNC_REQUEST:
            return {
                ...state, [action.payload.actionType] : {
                    isLoading: true,
                    isSuccess: false,
                    error: null
                }
            };

        case PROMISE_ASYNC_SUCCESS:
            return {
                ...state, [action.payload.actionType] : {
                    isLoading: false,
                    isSuccess: true,
                    error: null
                }
            };

        case PROMISE_ASYNC_FAILED:
            return {
                ...state, [action.payload.actionType] : {
                    isLoading: false,
                    isSuccess: false,
                    error: action.payload.actionError
                }
            };
    }

    return state;
}
