import {ILoadingState, IActionLoadingState} from "./reducer";

export function getLoadingState(state: any, actionType: string, actionId?: string): ILoadingState {
    if (!state) {
        throw new Error("Invalid state!");
    }

    if (!actionType) {
        throw new Error("Invalid action type!");
    }

    if (!state.promiseTrackReducer) {
        return emptyObject;
    }

    let actionLoadingState: IActionLoadingState = state.promiseTrackReducer[actionType];

    if (!actionId) {
        return actionLoadingState || emptyObject;
    }

    if (!actionLoadingState || !actionLoadingState.items) {
        return emptyObject;
    }

    let loadingState: ILoadingState = actionLoadingState.items[actionId];

    return loadingState || emptyObject;
}

export function getItemLoadingState(actionLoadingState: IActionLoadingState, actionId: string): ILoadingState {
    if (!actionLoadingState) {
        throw new Error("Invalid action state!");
    }

    if (!actionId){
        throw new Error("Invalid action id!");
    }

    if (actionLoadingState.items) {
        return actionLoadingState.items[actionId] || emptyObject;
    }

    return emptyObject;
}

export const emptyObject: ILoadingState = {
    didRun: false
};
