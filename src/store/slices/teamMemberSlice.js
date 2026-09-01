import { teamMemberApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchTeamMembers = createAsyncThunk(
  "teamMember/fetchTeamMembers",
  async (businessId, { rejectWithValue }) => {
    try {
      if (!businessId) return rejectWithValue("Business ID is required");
      const response = await teamMemberApi.getAll(businessId);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch team members";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  }
);

export const createTeamMember = createAsyncThunk(
  "teamMember/createTeamMember",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const businessId = auth.user?.businesses?.[0]?.id || auth.user?.business_id;
      if (!businessId) {
        throw new Error("No business associated with this account.");
      }

      const payload = { ...data, business_id: businessId };
      const response = await teamMemberApi.create(payload);
      Toast.show({ type: "success", text1: "Success", text2: "Staff member added" });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create team member";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  }
);

export const updateTeamMember = createAsyncThunk(
  "teamMember/updateTeamMember",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await teamMemberApi.update(id, data);
      Toast.show({ type: "success", text1: "Success", text2: "Staff member updated" });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update team member";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  }
);

export const deleteTeamMember = createAsyncThunk(
  "teamMember/deleteTeamMember",
  async (id, { rejectWithValue }) => {
    try {
      await teamMemberApi.delete(id);
      Toast.show({ type: "success", text1: "Success", text2: "Staff member deleted" });
      return id;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to delete team member";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  teamMembers: [],
  loading: false,
  error: null,
};

const teamMemberSlice = createSlice({
  name: "teamMember",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.teamMembers.push(action.payload);
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const index = state.teamMembers.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.teamMembers[index] = action.payload;
        }
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.teamMembers = state.teamMembers.filter((m) => m.id !== action.payload);
      });
  },
});

export default teamMemberSlice.reducer;
