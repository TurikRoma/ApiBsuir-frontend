import { configureStore } from "@reduxjs/toolkit";

import { scheduleReducer } from "./slices/schedules";
import { CorpsReducer } from "./slices/Corps";
import { WeeksReducer } from "./slices/weeks";

const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
    corps: CorpsReducer,
    weeks: WeeksReducer,
  },
});

export default store;
