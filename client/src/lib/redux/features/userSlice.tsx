import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define an interface for your slice's state
interface UserInfoState {
    userInfo: Record<string, any>; // Replace 'any' with a specific user object interface if you have one
}

// 2. Apply the interface to your initial state
const initialState: UserInfoState = {
    userInfo: {},    
};

const userSlice = createSlice({
    name: "UserInfo",
    initialState,
    reducers: {
        // Redux Toolkit now automatically knows the type of 'state' based on initialState
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