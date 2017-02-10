import { expect } from "chai";

import {isLoading, isSuccess, hasErrors, getErrors} from "../src/helpers";
import {ILoadingState} from "../src/reducer";

const LOADING_ACTION: string = "LOADING_ACTION";
const SUCCESS_ACTION: string = "SUCCESS_ACTION";
const ERROR_ACTION: string = "ERROR_ACTION";

const loadingAction: ILoadingState = {
    isLoading: true,
    isSuccess: false,
    didRun: false,
    error: null
};

const successfulAction: ILoadingState = {
    isLoading: false,
    isSuccess: true,
    didRun: true,
    error: null
};

const errorAction: ILoadingState = {
    isLoading: false,
    isSuccess: false,
    didRun: true,
    error: new Error("something happened!")
};

const storeWithNoActions = {
    promiseTrackReducer: {}
};

const storeWithLoading = {
    promiseTrackReducer: {
        [LOADING_ACTION]: loadingAction
    }
};

const storeWithSuccess = {
    promiseTrackReducer: {
        [SUCCESS_ACTION]: successfulAction
    }
};

const storeWithError = {
    promiseTrackReducer: {
        [ERROR_ACTION]: errorAction
    }
};

const storeWithLoadingAndSuccess = {
    promiseTrackReducer: {
        [LOADING_ACTION]: loadingAction,
        [SUCCESS_ACTION]: successfulAction
    }
};

const storeWithLoadingAndError = {
    promiseTrackReducer: {
        [LOADING_ACTION]: loadingAction,
        [ERROR_ACTION]: errorAction
    }
};

const storeWithSuccessAndError = {
    promiseTrackReducer: {
        [SUCCESS_ACTION]: successfulAction,
        [ERROR_ACTION]: errorAction
    }
};

const storeWithLoadingSuccessAndError = {
    promiseTrackReducer: {
        [LOADING_ACTION]: loadingAction,
        [SUCCESS_ACTION]: successfulAction,
        [ERROR_ACTION]: errorAction
    }
};

describe("helpers - compute state", () => {
    describe("isLoading()", () => {
        it("should handle an empty store", () => {
            expect(isLoading.bind(null, null, [LOADING_ACTION])).to.throw("Invalid state!");
            expect(isLoading({}, [LOADING_ACTION])).to.equal(false);
            expect(isLoading(storeWithNoActions, [LOADING_ACTION])).to.equal(false);
        });

        it("should handle a store with a single action", () => {
            expect(isLoading(storeWithLoading, [LOADING_ACTION])).to.equal(true);
            expect(isLoading(storeWithError, [LOADING_ACTION])).to.equal(false);
            expect(isLoading(storeWithSuccess, [LOADING_ACTION])).to.equal(false);
        });

        it("should handle a store with more actions", () => {
            expect(isLoading(storeWithLoadingAndSuccess, [LOADING_ACTION])).to.equal(true);
            expect(isLoading(storeWithLoadingAndError, [LOADING_ACTION])).to.equal(true);
            expect(isLoading(storeWithSuccessAndError, [LOADING_ACTION])).to.equal(false);
            expect(isLoading(storeWithLoadingSuccessAndError, [LOADING_ACTION])).to.equal(true);
        });

        it("should handle checking more actions", () => {
            expect(isLoading(storeWithLoading, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(true);
            expect(isLoading(storeWithError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(isLoading(storeWithSuccess, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);

            expect(isLoading(storeWithLoadingAndSuccess, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(true);
            expect(isLoading(storeWithLoadingAndError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(true);
            expect(isLoading(storeWithSuccessAndError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(isLoading(storeWithLoadingSuccessAndError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(true);
        });
    });

    describe("isSuccess()", () => {
        it("should handle an empty store", () => {
            expect(isSuccess.bind(null, null, [SUCCESS_ACTION])).to.throw("Invalid state!");
            expect(isSuccess({}, [SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithNoActions, [SUCCESS_ACTION])).to.equal(false);
        });

        it("should handle a store with a single action", () => {
            expect(isSuccess(storeWithLoading, [SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithError, [SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithSuccess, [SUCCESS_ACTION])).to.equal(true);
        });

        it("should handle a store with more actions", () => {
            expect(isSuccess(storeWithLoadingAndSuccess, [SUCCESS_ACTION])).to.equal(true);
            expect(isSuccess(storeWithLoadingAndError, [SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithSuccessAndError, [SUCCESS_ACTION])).to.equal(true);
            expect(isSuccess(storeWithLoadingSuccessAndError, [SUCCESS_ACTION])).to.equal(true);
        });

        it("should handle checking more actions", () => {
            expect(isSuccess(storeWithLoading, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithSuccess, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);

            expect(isSuccess(storeWithLoadingAndSuccess, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithLoadingAndError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithSuccessAndError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(isSuccess(storeWithLoadingSuccessAndError, [LOADING_ACTION, SUCCESS_ACTION])).to.equal(false);
        });
    });

    describe("hasErrors()", () => {
        it("should handle an empty store", () => {
            expect(hasErrors.bind(null, null, [ERROR_ACTION])).to.throw("Invalid state!");
            expect(hasErrors({}, [ERROR_ACTION])).to.equal(false);
            expect(hasErrors(storeWithNoActions, [ERROR_ACTION])).to.equal(false);
        });

        it("should handle a store with a single action", () => {
            expect(hasErrors(storeWithLoading, [ERROR_ACTION])).to.equal(false);
            expect(hasErrors(storeWithError, [ERROR_ACTION])).to.equal(true);
            expect(hasErrors(storeWithSuccess, [ERROR_ACTION])).to.equal(false);
        });

        it("should handle a store with more actions", () => {
            expect(hasErrors(storeWithLoadingAndSuccess, [ERROR_ACTION])).to.equal(false);
            expect(hasErrors(storeWithLoadingAndError, [ERROR_ACTION])).to.equal(true);
            expect(hasErrors(storeWithSuccessAndError, [ERROR_ACTION])).to.equal(true);
            expect(hasErrors(storeWithLoadingSuccessAndError, [ERROR_ACTION])).to.equal(true);
        });

        it("should handle checking more actions", () => {
            expect(hasErrors(storeWithLoading, [ERROR_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(hasErrors(storeWithError, [ERROR_ACTION, SUCCESS_ACTION])).to.equal(true);
            expect(hasErrors(storeWithSuccess, [ERROR_ACTION, SUCCESS_ACTION])).to.equal(false);

            expect(hasErrors(storeWithLoadingAndSuccess, [ERROR_ACTION, SUCCESS_ACTION])).to.equal(false);
            expect(hasErrors(storeWithLoadingAndError, [ERROR_ACTION, SUCCESS_ACTION])).to.equal(true);
            expect(hasErrors(storeWithSuccessAndError, [ERROR_ACTION, SUCCESS_ACTION])).to.equal(true);
            expect(hasErrors(storeWithLoadingSuccessAndError, [ERROR_ACTION, SUCCESS_ACTION])).to.equal(true);
        });
    });

    describe("getErrors()", () => {
        it("should handle an empty store", () => {
            expect(getErrors.bind(null, null, [ERROR_ACTION])).to.throw("Invalid state!");
            expect(getErrors({}, [ERROR_ACTION])).to.be.empty;
            expect(getErrors(storeWithNoActions, [ERROR_ACTION])).to.be.empty;
        });

        it("should handle a store with a single action", () => {
            expect(getErrors(storeWithLoading, [ERROR_ACTION])).to.be.empty;
            expect(getErrors(storeWithError, [ERROR_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
            expect(getErrors(storeWithSuccess, [ERROR_ACTION])).to.be.empty;
        });

        it("should handle a store with more actions", () => {
            expect(getErrors(storeWithLoadingAndSuccess, [ERROR_ACTION])).to.be.empty;
            expect(getErrors(storeWithLoadingAndError, [ERROR_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
            expect(getErrors(storeWithSuccessAndError, [ERROR_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
            expect(getErrors(storeWithLoadingSuccessAndError, [ERROR_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
        });

        it("should handle checking more actions", () => {
            expect(getErrors(storeWithLoading, [ERROR_ACTION, SUCCESS_ACTION])).to.be.empty;
            expect(getErrors(storeWithError, [ERROR_ACTION, SUCCESS_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
            expect(getErrors(storeWithSuccess, [ERROR_ACTION, SUCCESS_ACTION])).to.be.empty;

            expect(getErrors(storeWithLoadingAndSuccess, [ERROR_ACTION, SUCCESS_ACTION])).to.be.empty;
            expect(getErrors(storeWithLoadingAndError, [ERROR_ACTION, SUCCESS_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
            expect(getErrors(storeWithSuccessAndError, [ERROR_ACTION, SUCCESS_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
            expect(getErrors(storeWithLoadingSuccessAndError, [ERROR_ACTION, SUCCESS_ACTION])).to.have.haveOwnProperty(ERROR_ACTION);
        });
    });
});
