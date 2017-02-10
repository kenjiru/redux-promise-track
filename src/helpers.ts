import {ILoadingState, IActionLoadingState} from "./reducer";

export function isLoading(state: any, actionTypes: string[]): boolean {
    for (let index in actionTypes) {
        let loadingState: ILoadingState = getLoadingState(state, actionTypes[index]);

        if (loadingState.isLoading === true) {
            return true;
        }
    }

    return false;
}

export function isSuccess(state: any, actionTypes: string[]): boolean {
    for (let index in actionTypes) {
        let loadingState: ILoadingState = getLoadingState(state, actionTypes[index]);

        if (loadingState.isSuccess !== true) {
            return false;
        }
    }

    return true;
}

export function hasErrors(state: any, actionTypes: string[]): boolean {
    for (let index in actionTypes) {
        let loadingState: ILoadingState = getLoadingState(state, actionTypes[index]);

        if (typeof loadingState.error !== "undefined" && loadingState.error !== null) {
            return true;
        }
    }

    return false;
}

export function getErrors(state: any, actionTypes: string[]): IErrorsMap {
    let errors: IErrorsMap = {};

    for (let index in actionTypes) {
        let actionType: string = actionTypes[index];
        let loadingState: ILoadingState = getLoadingState(state, actionType);
        let error: any = loadingState.error;

        if (typeof error !== "undefined" && error !== null) {
            errors[actionType] = error;
        }
    }

    return errors;
}

export function getLoadingState(state: any, actionType: string, actionId?: string): ILoadingState {
    let promiseTrackReducer: ILoadingStateMap = getPromiseTrackState(state);

    if (!actionType) {
        throw new Error("Invalid action type!");
    }

    let actionLoadingState: IActionLoadingState = promiseTrackReducer[actionType];

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

export function mapStateToProps<S,T>(mapState: (state: S) => T,
                              mapLoadingState: (state: S) => ILoadingStateMap): (state: S, ownProps: T) => T {
    return (state: S, ownProps: T): T => {
        let loadingStates: ILoadingStateMap = mapLoadingState(state);

        if (isAllLoading(loadingStates)) {
            return Object.assign({}, ownProps, loadingStates);
        }

        return Object.assign({}, ownProps, mapState(state), loadingStates);
    }
}

function isAllLoading(loadingStates: ILoadingStateMap): boolean {
    for (let key in loadingStates) {
        if (loadingStates.hasOwnProperty(key)) {
            if (loadingStates[key].isLoading) {
                return true
            }
        }
    }

    return false;
}

function getPromiseTrackState(state: any): ILoadingStateMap {
    if (!state) {
        throw new Error("Invalid state!");
    }

    let promiseTrackReducer: ILoadingStateMap = state.promiseTrackReducer;

    if (!promiseTrackReducer) {
        return {};
    }

    return promiseTrackReducer;
}

export const emptyObject: ILoadingState = {
    didRun: false
};

export interface ILoadingStateMap {
    [key: string]: ILoadingState
}

export interface IErrorsMap {
    [key: string]: any;
}
