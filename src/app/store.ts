import { combineSlices, configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit"
import { counterSlice, incrementAsyncEpic } from "../features/counter/counterSlice"
import { createEpicMiddleware, combineEpics } from "redux-observable"

const epicMiddleware = createEpicMiddleware()

const reducer = combineSlices(counterSlice)

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
})

const rootEpic = combineEpics(incrementAsyncEpic)

epicMiddleware.run(rootEpic)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
