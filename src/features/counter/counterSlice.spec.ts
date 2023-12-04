import { StateObservable } from "redux-observable"
import {
  counterSlice,
  CounterState,
  incrementAsync,
  incrementAsyncEpic,
  incrementAsyncFulfilled,
  incrementAsyncPending,
} from "./counterSlice"
import { lastValueFrom, of, toArray } from "rxjs"
import { marbleTest } from "../../marbleTest"

describe("counter reducer", () => {
  const initialState: CounterState = {
    value: 3,
    status: "idle",
  }
  it("should handle initial state", () => {
    expect(counterSlice.reducer(undefined, { type: "unknown" })).toEqual({
      value: 0,
      status: "idle",
    })
  })

  it("should handle increment", () => {
    const actual = counterSlice.reducer(initialState, counterSlice.actions.increment())
    expect(actual.value).toEqual(4)
  })

  it("should handle decrement", () => {
    const actual = counterSlice.reducer(initialState, counterSlice.actions.decrement())
    expect(actual.value).toEqual(2)
  })

  it("should handle incrementByAmount", () => {
    const actual = counterSlice.reducer(initialState, counterSlice.actions.incrementByAmount(2))
    expect(actual.value).toEqual(5)
  })
})


describe("counter epic", () => {
  it("should handle incrementAsync", async () => {
    const action$ = of(incrementAsync(1))
    const state$ = new StateObservable(of(), undefined)
    const output$ = incrementAsyncEpic(action$, state$, undefined)
    const result = await lastValueFrom(output$.pipe(toArray()))

    expect(result).toEqual([
      incrementAsyncPending(),
      incrementAsyncFulfilled(1),
    ])
  })

  it("should handle marbles", async () => {
    marbleTest({
      epic: incrementAsyncEpic,
      actions: "a 100ms a 100ms a",
      expected: "b 100ms b 100ms b 297ms c 100ms c 100ms c",
      values: {
        a: incrementAsync(1),
        b: incrementAsyncPending(),
        c: incrementAsyncFulfilled(1),
      },
    })
  })
})
