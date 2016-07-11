import assign from "object-assign";
import { Promise } from "es6-promise";
import { spy } from "sinon";
import chai, { expect } from "chai";

import { promiseMiddleware } from "../src/middleware";

function noop() {}
const GIVE_ME_META = "GIVE_ME_META";
function metaMiddleware() {
    return next => action =>
        action.type === GIVE_ME_META
            ? next(assign({}, action, { meta: "here you go" }))
            : next(action);
}

describe("promiseMiddleware", () => {
    let baseDispatch;
    let dispatch;
    let dummyResult;
    let err;

    beforeEach(() => {
        baseDispatch = spy();
        dispatch = function d(action) {
            const methods = { dispatch: d, getState: noop };
            return metaMiddleware()(promiseMiddleware(methods)(baseDispatch))(action);
        };
        dummyResult = { foo: "bar" };
        err = new Error();
    });

    it("handles Flux standard actions", () => {
        dispatch({
            type: "ACTION_TYPE",
            payload: Promise.resolve(dummyResult)
        }).then(() => {
            expect(baseDispatch.callCount).to.equal(3);
            expect(baseDispatch.getCall(2).args[0]).to.deep.equal({
                type: "ACTION_TYPE",
                payload: dummyResult
            });
        });

        dispatch({
            type: "ACTION_TYPE",
            payload: Promise.reject(err)
        }).then(() => {
            expect(baseDispatch.callCount).to.equal(6);
            expect(baseDispatch.getCall(5).args[0]).to.deep.equal({
                type: "ACTION_TYPE",
                payload: err,
                error: true
            });
        }).catch(noop);

        dispatch({
            type: "ACTION_TYPE",
            payload: Promise.reject(err)
        }).then((result) => {
            expect(result).to.eventually.be.rejectedWith(err);
        })
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

    it("starts async dispatches from beginning of middleware chain", () => {
        dispatch(Promise.resolve({ type: GIVE_ME_META })).then(() => {
            dispatch({ type: GIVE_ME_META });

            expect(baseDispatch.args.map(args => args[0].meta)).to.eql([
                "here you go",
                "here you go"
            ]);
        });
    });
});
