import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfoState {
  userInfo: Record<string, any>; 
}

const initialState: UserInfoState = {
  userInfo: {},    
};

const userSlice = createSlice({
  name: "UserInfo",
  initialState,
  reducers: {
    loadUserInfo: (state, action: PayloadAction<Record<string, any>>) => {
      state.userInfo = action.payload;
    }, 
    removeUserInfo: (state) => {
      state.userInfo = {};
    }
  }
});

export const { loadUserInfo, removeUserInfo } = userSlice.actions;
export default userSlice.reducer;