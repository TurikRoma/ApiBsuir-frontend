import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weeksList: [1],
};

const weekSlice = createSlice({
  name: "weeks",
  initialState,
  reducers: {
    changeOptionsWeeks: (state, aaction) => {
      state.weeksList = aaction.payload;
    },
  },
});

export const { changeOptionsWeeks } = weekSlice.actions;
export const WeeksReducer = weekSlice.reducer;
