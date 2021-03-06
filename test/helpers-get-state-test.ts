import { expect } from "chai";

import {getLoadingState, getItemLoadingState, emptyObject} from "../src/helpers";
import {IPromiseTrackStore, ILoadingState, IActionLoadingState} from "../src/reducer";

const ACTION_TYPE: string = "ACTION_TYPE";
const ANOTHER_ACTION_TYPE: string = "ANOTHER_ACTION_TYPE";

const ACTION_ID: string = "ACTION_ID";
const ANOTHER_ACTION_ID: string = "ANOTHER_ACTION_ID";

const successfulAction: ILoadingState = {
    isLoading: false,
    isSuccess: true,
    didRun: true,
    error: null
};

const emptyStore = {
    promiseTrackReducer: {}
};

const storeWithEmptyAction = {
    promiseTrackReducer: {
        [ACTION_TYPE]: emptyObject
    }
};

const storeWithAction = {
    promiseTrackReducer: {
        [ACTION_TYPE]: successfulAction
    }
};

const storeWithSubaction = {
    promiseTrackReducer: {
        [ACTION_TYPE]: {
            items: {
                [ACTION_ID]: successfulAction
            }
        }
    }
};

describe("helpers - get state", () => {
    describe("getLoadingState()", () => {
        it("should handle an undefined store or action", () => {
            expect(getLoadingState.bind(null, null, null)).to.throw("Invalid state!");
            expect(getLoadingState.bind(null, {}, null)).to.throw("Invalid action type!");
            expect(getLoadingState({}, ACTION_TYPE)).to.deep.equal(emptyObject);
        });

        it("should handle an empty store", () => {
            expect(getLoadingState(emptyStore, ACTION_TYPE)).to.deep.equal(emptyObject);
            expect(getLoadingState(emptyStore, ACTION_TYPE, ACTION_ID)).to.deep.equal(emptyObject);
        });

        it("should handle getting an action", () => {
            expect(getLoadingState(storeWithEmptyAction, ACTION_TYPE)).to.deep.equal(emptyObject);
            expect(getLoadingState(storeWithAction, ACTION_TYPE)).to.be.deep.equal(successfulAction);
            expect(getLoadingState(storeWithEmptyAction, ANOTHER_ACTION_TYPE)).to.deep.equal(emptyObject);
        });

        it("should handle getting an sub-action", () => {
            expect(getLoadingState(storeWithEmptyAction, ACTION_TYPE, ACTION_ID)).to.deep.equal(emptyObject);
            expect(getLoadingState(storeWithAction, ACTION_TYPE, ACTION_ID)).to.deep.equal(emptyObject);
            expect(getLoadingState(storeWithSubaction, ACTION_TYPE, ACTION_ID)).to.be.deep.equal(successfulAction);
            expect(getLoadingState(storeWithSubaction, ACTION_TYPE, ANOTHER_ACTION_ID)).to.deep.equal(emptyObject);
        });
    });

    describe("getItemLoadingState()", () => {
        it("should handle an undefined action state", () => {
            expect(getItemLoadingState.bind(null, null, null)).to.throw("Invalid action state!");
            expect(getItemLoadingState.bind(null, {}, null)).to.throw("Invalid action id!");
        });

        it("should handle an empty action state", () => {
            expect(getItemLoadingState({}, ACTION_ID)).to.deep.equal(emptyObject);
            expect(getItemLoadingState({ items: {} }, ACTION_ID)).to.deep.equal(emptyObject);
        });

        it("should handle valid action state", () => {
            let someActionState: IActionLoadingState = {
                items: {
                    [ACTION_ID]: successfulAction
                }
            };

            expect(getItemLoadingState(someActionState, ACTION_ID)).to.be.deep.equal(successfulAction);
            expect(getItemLoadingState(someActionState, ANOTHER_ACTION_ID)).to.deep.equal(emptyObject);
        });
    });
});
