import "babel-polyfill";
import { spy } from "sinon";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import promiseMiddleware from "../src/middleware";

global.expect = chai.expect;
chai.use(chaiAsPromised);

function noop() {}
const GIVE_ME_META = "GIVE_ME_META";
function metaMiddleware() {
    return next => action =>
        action.type === GIVE_ME_META
            ? next({ ...action, meta: "here you go" })
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

    it("handles Flux standard actions", async () => {
        await dispatch({
            type: "ACTION_TYPE",
            payload: Promise.resolve(dummyResult)
        });

        expect(baseDispatch.callCount).to.equal(3);
        expect(baseDispatch.getCall(2).args[0]).to.deep.equal({
            type: "ACTION_TYPE",
            payload: dummyResult
        });

        await dispatch({
            type: "ACTION_TYPE",
            payload: Promise.reject(err)
        }).catch(noop);

        expect(baseDispatch.callCount).to.equal(6);
        expect(baseDispatch.getCall(5).args[0]).to.deep.equal({
            type: "ACTION_TYPE",
            payload: err,
            error: true
        });

        await expect(dispatch({
            type: "ACTION_TYPE",
            payload: Promise.reject(err)
        })).to.eventually.be.rejectedWith(err);
    });

    it("handles promises", async () => {
        await dispatch(Promise.resolve(dummyResult));
        expect(baseDispatch.calledOnce).to.be.true;
        expect(baseDispatch.firstCall.args[0]).to.equal(dummyResult);

        await expect(dispatch(Promise.reject(err))).to.eventually.be.rejectedWith(err);
    });

    it("ignores non-promises", async () => {
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

    it("starts async dispatches from beginning of middleware chain", async () => {
        await dispatch(Promise.resolve({ type: GIVE_ME_META }));
        dispatch({ type: GIVE_ME_META });
        expect(baseDispatch.args.map(args => args[0].meta)).to.eql([
            "here you go",
            "here you go"
        ]);
    });
});
