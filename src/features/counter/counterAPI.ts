import { delay, of } from "rxjs";

// A mock function to mimic making an async request for data
// using RxJS so the timer can be replaced in tests
export const fetchCount = (amount: number) => of(amount).pipe(delay(500));
