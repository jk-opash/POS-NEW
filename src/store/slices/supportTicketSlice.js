import { supportTicketApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchSupportTickets = createAsyncThunk(
  "supportTicket/fetchTickets",
  async (params, { rejectWithValue }) => {
    try {
      const res = await supportTicketApi.getAll(params);
      const dataArray = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];
      return dataArray;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createSupportTicket = createAsyncThunk(
  "supportTicket/createTicket",
  async (data, { rejectWithValue }) => {
    try {
      const res = await supportTicketApi.create(data);
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const supportTicketSlice = createSlice({
  name: "supportTicket",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
    createLoading: false,
    updateLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload || [];
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            action.payload?.error ||
            action.payload?.message ||
            "Failed to fetch support tickets.",
        });
        state.loading = false;
        state.error = action.payload;
      })
      // Create Ticket
      .addCase(createSupportTicket.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createSupportTicket.fulfilled, (state, action) => {
        state.createLoading = false;
        state.tickets.unshift(action.payload);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Support ticket created.",
        });
      })
      .addCase(createSupportTicket.rejected, (state, action) => {
        state.createLoading = false;
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            action.payload?.error ||
            action.payload?.message ||
            "Failed to create support ticket.",
        });
      });
  },
});

export default supportTicketSlice.reducer;
