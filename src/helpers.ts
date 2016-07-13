import {ILoadingState, IActionLoadingState} from "./reducer";

export function getLoadingState(state: any, actionType: string, actionId?: string): ILoadingState {
    if (!state) {
        throw new Error("Invalid state");
    }

    if (!actionType) {
        throw new Error("Invalid action type");
    }

    if (!state.promiseTrackReducer) {
        return {};
    }

    let actionLoadingState: IActionLoadingState = state.promiseTrackReducer[actionType];

    if (!actionId) {
        return actionLoadingState || {};
    }

    if (!actionLoadingState || !actionLoadingState.items) {
        return {};
    }

    let loadingState: ILoadingState = actionLoadingState.items[actionId];

    return loadingState || {};
}
