import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  corpsList: [1],
};

const corpsSlice = createSlice({
  name: "Corps",
  initialState,
  reducers: {
    changeOptionsCorps: (state, aaction) => {
      state.corpsList = aaction.payload;
    },
  },
});

export const { changeOptionsCorps } = corpsSlice.actions;
export const CorpsReducer = corpsSlice.reducer;
