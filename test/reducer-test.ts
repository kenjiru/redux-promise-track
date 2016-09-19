import {expect} from "chai";

import {promiseTrackReducer, IPromiseTrackStore, ILoadingState} from "../src/reducer";
import {
    promiseTrackSucceeded, promiseTrackRequest, promiseTrackFailed, removeLoadingState,
    removeLoadingStates
} from "../src/actions";

const MAIN_ACTION: string = "MAIN_ACTION";
const SECOND_ACTION: string = "SECOND_ACTION";
const ACTION_ID: string = "ACTION_ID";
const OTHER_ACTION_ID: string = "OTHER_ACTION_ID";
const err: Error = new Error("Generic error");

const loadingState: ILoadingState = {
    isLoading: true,
    isSuccess: false,
    didRun: true,
    error: null
};
const successState: ILoadingState = {
    isLoading: false,
    isSuccess: true,
    didRun: true,
    error: null
};
const errorState: ILoadingState = {
    isLoading: false,
    isSuccess: false,
    didRun: true,
    error: err
};

describe("promiseTrackReducer", () => {
    describe("handle main actions", () => {
        it("set the request state", () => {
            let state: IPromiseTrackStore = promiseTrackReducer({}, promiseTrackRequest({
                type: MAIN_ACTION
            }));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: loadingState
            });
        });

        it("set the success state", () => {
            let state: IPromiseTrackStore = promiseTrackReducer({}, promiseTrackSucceeded({
                type: MAIN_ACTION
            }));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: successState
            });
        });

        it("set the error state", () => {
            let state: IPromiseTrackStore = promiseTrackReducer({}, promiseTrackFailed({
                type: MAIN_ACTION
            }, err));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: errorState
            });
        });
    });


    describe("handle sub-actions (actions with ids)", () => {
        it("set the state of a sub-action, when the main action has no state", () => {
            let state: IPromiseTrackStore = promiseTrackReducer({}, promiseTrackSucceeded({
                type: MAIN_ACTION,
                meta: {
                    actionId: ACTION_ID
                }
            }));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: {
                    items: {
                        [ACTION_ID]: successState
                    }
                }
            });
        });

        it("set the state of a sub-action, when the main action has state", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: loadingState
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState, promiseTrackSucceeded({
                type: MAIN_ACTION,
                meta: {
                    actionId: ACTION_ID
                }
            }));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: Object.assign({}, loadingState, {
                    items: {
                        [ACTION_ID]: successState
                    }
                })
            });
        });

        it("set the state of a sub-action, when other sub-actions have state", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: {
                    items: {
                        [OTHER_ACTION_ID]: loadingState
                    }
                }
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState, promiseTrackSucceeded({
                type: MAIN_ACTION,
                meta: {
                    actionId: ACTION_ID
                }
            }));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: {
                    items: {
                        [OTHER_ACTION_ID]: loadingState,
                        [ACTION_ID]: successState
                    }
                }
            });
        });

        it("update the state of a sub-action", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: {
                    items: {
                        [ACTION_ID]: loadingState
                    }
                }
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState, promiseTrackSucceeded({
                type: MAIN_ACTION,
                meta: {
                    actionId: ACTION_ID
                }
            }));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: {
                    items: {
                        [ACTION_ID]: successState
                    }
                }
            });
        });

        it("update the state of a the main action that has sub-actions", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: {
                    items: {
                        [ACTION_ID]: successState
                    }
                }
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState, promiseTrackSucceeded({
                type: MAIN_ACTION
            }));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: Object.assign({}, successState, {
                    items: {
                        [ACTION_ID]: successState
                    }
                })
            });
        });
    });

    describe("deleting the loading state", () => {
        it("should delete the loading state of single action", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: loadingState
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState, removeLoadingState(MAIN_ACTION));

            expect(state).to.exist.and.be.empty;
        });

        it("should delete the loading state of single action, keeping the others", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: loadingState,
                [SECOND_ACTION]: successState
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState, removeLoadingState(MAIN_ACTION));

            expect(state).to.deep.equal({
                [SECOND_ACTION]: successState
            });
        });

        it("should delete multiple actions", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: loadingState,
                [SECOND_ACTION]: successState
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState,
                removeLoadingStates([MAIN_ACTION, SECOND_ACTION]));

            expect(state).to.exist.and.be.empty;
        });

        it("should delete the loading state of a sub-action", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: Object.assign({}, successState, {
                    items: {
                        [ACTION_ID]: successState
                    }
                })
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState,
                removeLoadingState(MAIN_ACTION, ACTION_ID));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: Object.assign({}, successState, {
                    items: {}
                })
            });
        });

        it("should delete the loading state of a sub-action, keeping the other sub-actions", () => {
            let initialState: IPromiseTrackStore = {
                [MAIN_ACTION]: Object.assign({}, successState, {
                    items: {
                        [ACTION_ID]: successState,
                        [OTHER_ACTION_ID]: loadingState
                    }
                })
            };

            let state: IPromiseTrackStore = promiseTrackReducer(initialState,
                removeLoadingState(MAIN_ACTION, ACTION_ID));

            expect(state).to.deep.equal({
                [MAIN_ACTION]: Object.assign({}, successState, {
                    items: {
                        [OTHER_ACTION_ID]: loadingState
                    }
                })
            });
        });
    });
});
