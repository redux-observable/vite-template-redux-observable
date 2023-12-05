import { StateObservable } from "redux-observable";
import {
  counterSlice,
  CounterState,
  incrementAsync,
  incrementAsyncEpic,
  incrementAsyncFulfilled,
  incrementAsyncPending,
  incrementIfOdd,
  incrementIfOddEpic,
} from "./counterSlice";
import { lastValueFrom, of, toArray } from "rxjs";
import { marbleTest } from "../../marbleTest";

describe("counter reducer", () => {
  const initialState: CounterState = {
    value: 3,
    status: "idle",
  };
  it("should handle initial state", () => {
    expect(counterSlice.reducer(undefined, { type: "unknown" })).toEqual({
      value: 0,
      status: "idle",
    });
  });

  it("should handle increment", () => {
    const actual = counterSlice.reducer(
      initialState,
      counterSlice.actions.increment()
    );
    expect(actual.value).toEqual(4);
  });

  it("should handle decrement", () => {
    const actual = counterSlice.reducer(
      initialState,
      counterSlice.actions.decrement()
    );
    expect(actual.value).toEqual(2);
  });

  it("should handle incrementByAmount", () => {
    const actual = counterSlice.reducer(
      initialState,
      counterSlice.actions.incrementByAmount(2)
    );
    expect(actual.value).toEqual(5);
  });
});

describe("counter epic", () => {
  // since epics are just functions you can test them in isolation
  it("should handle incrementAsync", async () => {
    const action$ = of(incrementAsync(1));
    const state = { counter: { value: 0, status: "idle" as const } };
    const state$ = new StateObservable(of(state), state);
    const output$ = incrementAsyncEpic(action$, state$, undefined);
    const result = await lastValueFrom(output$.pipe(toArray()));

    expect(result).toEqual([
      incrementAsyncPending(),
      incrementAsyncFulfilled(1),
    ]);
  });

  // however that's a lot of boilerplate, and we haven't tested the time factor
  // so instead we can use an abstraction that includes marble testing
  it("should handle marbles", () => {
    marbleTest({
      epic: incrementAsyncEpic,
      // the letters are marbles, they are mapped to values in the values object
      // in between marbles you can add a time value to indicate delays or a - for single frame
      actions: "a 100ms a 100ms a",
      expected: "b 100ms b 100ms b 297ms c 100ms c 100ms c",
      values: {
        a: incrementAsync(1),
        b: incrementAsyncPending(),
        c: incrementAsyncFulfilled(1),
      },
    });
  });
});

describe("incrementIfOddEpic", () => {
  it("should increment if odd", () => {
    marbleTest({
      epic: incrementIfOddEpic,
      actions: "a-a",
      states: "-t-",
      expected: "--b",
      values: {
        a: incrementIfOdd(1),
        b: counterSlice.actions.incrementByAmount(1),
        s: { counter: { value: 0, status: "init" as const } }, // s is used for initial state so it doesn't have to be in the marble diagram
        t: { counter: { value: 1, status: "init" as const } }, // pretend state got incremented
      },
    });
  });
});
