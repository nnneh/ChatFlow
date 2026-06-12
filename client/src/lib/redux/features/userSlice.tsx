import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfo: {},
};

const userSlice = createSlice({
  name: 'UserInfo',
  initialState,
  reducers: {
    loadUserInfo : (state, action)=>{
        state.userInfo = action.payload
    },
    removeUserInfo : (state)=>{
        state.userInfo = {}
    }
  }
})


export const {loadUserInfo, removeUserInfo} = userSlice.actions

export default userSlice.reducer