import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchSchedule = createAsyncThunk(
  "schedule/fetchSchedule",
  async (auditorieNumber) => {
    const { data } = await axios.get(`/auditories/${auditorieNumber}`);
    return data;
  }
);

const initialState = {
  auditoriesSchedule: {
    item: [],
    status: "loading",
    sorteredAuditoriesList: [],
  },
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    changeTypeSearchAction: (state) => {
      state.auditoriesSchedule.item = [];
      state.auditoriesSchedule.status = "loading";
    },
    setSorteredAuditoriesList: (state, payload) => {
      state.auditoriesSchedule.sorteredAuditoriesList = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.auditoriesSchedule.status = "loading";
        state.auditoriesSchedule.item = [];
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.auditoriesSchedule.status = "loaded";
        state.auditoriesSchedule.item = action.payload.content;
      })
      .addCase(fetchSchedule.rejected, (state) => {
        state.auditoriesSchedule.status = "error";
        state.auditoriesSchedule.item = [];
      });
  },
});

export const { changeTypeSearchAction, setSorteredAuditoriesList } =
  scheduleSlice.actions;
export const scheduleReducer = scheduleSlice.reducer;
