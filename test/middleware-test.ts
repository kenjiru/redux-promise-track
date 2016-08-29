import { spy } from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { expect } from "chai";

import { promiseTrackMiddleware } from "../src/middleware";
import {PROMISE_TRACK_REQUEST, PROMISE_TRACK_SUCCESS} from "../src/actions";

function noop() {}
const GIVE_ME_META = "GIVE_ME_META";
function metaMiddleware() {
    return next => action =>
        action.type === GIVE_ME_META
            ? next(Object.assign({}, action, { meta: "here you go" }))
            : next(action);
}

describe("promiseTrackMiddleware", () => {
    let baseDispatch;
    let dispatch;
    let dummyResult;
    let err;

    beforeEach(() => {
        baseDispatch = spy();
        dispatch = function d(action) {
            const methods = { dispatch: d, getState: noop };
            return metaMiddleware()(promiseTrackMiddleware(methods)(baseDispatch))(action);
        };
        dummyResult = { foo: "bar" };
        err = new Error();
    });

    it("handles successful promises", (done: Function) => {
        dispatch({
            type: "ACTION_TYPE",
            payload: Promise.resolve(dummyResult)
        }).then(() => {
            expect(baseDispatch.callCount).to.equal(3);

            expect(baseDispatch.getCall(0).args[0]).to.deep.equal({
                type: PROMISE_TRACK_REQUEST,
                payload: {
                    actionType: "ACTION_TYPE"
                }
            });

            expect(baseDispatch.getCall(1).args[0]).to.deep.equal({
                type: PROMISE_TRACK_SUCCESS,
                payload: {
                    actionType: "ACTION_TYPE"
                }
            });

            expect(baseDispatch.getCall(2).args[0]).to.deep.equal({
                type: "ACTION_TYPE",
                payload: dummyResult
            });

            done();
        }).catch((error) => {
            done(error);
        });
    });

    it("handles successful promises with ids", (done: Function) => {
        dispatch({
            type: "ACTION_TYPE",
            payload: Promise.resolve(dummyResult),
            meta: {
                actionId: "ACTION_ID"
            }
        }).then(() => {
            expect(baseDispatch.callCount).to.equal(3);

            expect(baseDispatch.getCall(0).args[0]).to.deep.equal({
                type: PROMISE_TRACK_REQUEST,
                payload: {
                    actionType: "ACTION_TYPE",
                    actionId: "ACTION_ID"
                }
            });

            expect(baseDispatch.getCall(1).args[0]).to.deep.equal({
                type: PROMISE_TRACK_SUCCESS,
                payload: {
                    actionType: "ACTION_TYPE",
                    actionId: "ACTION_ID"
                }
            });

            expect(baseDispatch.getCall(2).args[0]).to.deep.equal({
                type: "ACTION_TYPE",
                payload: dummyResult,
                meta: {
                    actionId: "ACTION_ID"
                }
            });

            done();
        }).catch((error) => {
            done(error);
        });
    });

    it("handles failed promises", (done: Function) => {
        dispatch({
            type: "ACTION_TYPE",
            payload: Promise.reject(err)
        }).then((result) => {
            expect(baseDispatch.callCount).to.equal(6);
            expect(baseDispatch.getCall(5).args[0]).to.deep.equal({
                type: "ACTION_TYPE",
                payload: err,
                error: true
            });
            done();
        }).catch(() => {
            done();
        });
    });

    it("handles failed promises 2", (done: Function) => {
        dispatch({
            type: "ACTION_TYPE",
            payload: Promise.reject(err)
        }).then((result) => {
            expect(result).to.eventually.be.rejectedWith(err);
            done();
        }).catch(() => {
            done();
        });
    });

    it("handles promises", () => {
        dispatch(Promise.resolve(dummyResult)).then(() => {
            expect(baseDispatch.calledOnce).to.be.true;
            expect(baseDispatch.firstCall.args[0]).to.equal(dummyResult);
        });


        dispatch(Promise.reject(err)).then((result) => {
            expect(result).to.eventually.be.rejectedWith(err);
        })
    });

    it("ignores non-promises", () => {
        dispatch(dummyResult);
        expect(baseDispatch.calledOnce).to.be.true;
        expect(baseDispatch.firstCall.args[0]).to.equal(dummyResult);


        dispatch({ type: "ACTION_TYPE", payload: dummyResult });
        expect(baseDispatch.calledTwice).to.be.true;
        expect(baseDispatch.secondCall.args[0]).to.deep.equal({
            type: "ACTION_TYPE",
            payload: dummyResult
        });
    });

    it("starts async dispatches from beginning of middleware chain", (done: Function) => {
        dispatch(Promise.resolve({ type: GIVE_ME_META })).then(() => {
            dispatch({ type: GIVE_ME_META });

            expect(baseDispatch.args.map(args => args[0].meta)).to.eql([
                "here you go",
                "here you go"
            ]);
            done();
        });
    });
});
