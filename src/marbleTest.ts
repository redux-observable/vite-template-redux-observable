import { Epic, StateObservable } from "redux-observable"
import { TestScheduler } from "rxjs/testing"

const assertDeepEquals = (actual: unknown, expected: unknown) => {
  expect(actual).toEqual(expected)
}

export const marbleTest = <
  Input,
  Output extends Input = Input,
  State = void,
  Dependencies = unknown,
>({
  epic,
  actions,
  states = "",
  expected,
  values,
  dependencies,
}: {
  epic: Epic<Input, Output, State, Dependencies>
  actions: string
  states?: string
  expected: string
  values: Record<string, Input | Output | State>
  dependencies?: Dependencies
}) => {
  const testScheduler = new TestScheduler(assertDeepEquals)

  testScheduler.run(({ hot, expectObservable }) => {
    const action$ = hot(actions, values as Record<string, Input>)

    const state$ = new StateObservable(
      hot(states, values as Record<string, State>),
      values.s as State,
    )

    const output$ = epic(action$, state$, dependencies as Dependencies);

    expectObservable(output$).toBe(
      expected,
      values,
    )
  })
}
