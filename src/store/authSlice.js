// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { removeToken, setToken } from "../util/Cookies";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isLoggedIn: false
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      setToken(state.token);
    },
    logOut: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      removeToken();
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
