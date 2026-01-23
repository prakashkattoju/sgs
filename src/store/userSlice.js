import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    fullname: null,
    mobile: null,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.fullname = action.payload.fullname;
      state.mobile = action.payload.mobile;
    },
  }
});

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;