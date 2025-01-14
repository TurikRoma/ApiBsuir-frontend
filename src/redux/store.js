import { configureStore } from "@reduxjs/toolkit";

import { scheduleReducer } from "./slices/schedules";

const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
  },
});

export default store;
