import { delay, of } from "rxjs"

// A mock function to mimic making an async request for data
export const fetchCount = (amount: number) => of(amount).pipe(delay(500))
