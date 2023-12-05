import {
  combineSlices,
  configureStore,
} from "@reduxjs/toolkit";
import { Epic, combineEpics, createEpicMiddleware } from "redux-observable";
import {
  counterSlice,
  incrementAsyncEpic,
  incrementIfOddEpic,
} from "../features/counter/counterSlice";

const reducer = combineSlices(counterSlice);

export type RootState = ReturnType<typeof reducer>;
export type AppEpic = Epic<unknown, unknown, RootState>;

const epicMiddleware = createEpicMiddleware<unknown, unknown, RootState>();

const rootEpic = combineEpics(
  incrementAsyncEpic,
  incrementIfOddEpic
);

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
