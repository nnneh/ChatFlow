import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FriendRequest {
  requestId: string | number; 
}

interface FriendRequestState {
  friendRequestDetails: FriendRequest[];
}

const initialState: FriendRequestState = {
  friendRequestDetails: [],
};

const friendRequestDetailsSlice = createSlice({
  name: "friendRequestDetails",
  initialState,
  reducers: {
    // Use PayloadAction to tell TS what data is coming in the action
    setFriendRequestDetails: (state, action: PayloadAction<FriendRequest[]>) => {
      const nonDuplicateRequests = action.payload.filter(
        (r) => !state.friendRequestDetails.some((request) => request.requestId === r.requestId)
      );
      state.friendRequestDetails = [...state.friendRequestDetails, ...nonDuplicateRequests];
    },
    
    addFriendRequestDetails: (state, action: PayloadAction<FriendRequest>) => {
      if (state.friendRequestDetails.length === 0) {
        state.friendRequestDetails = [action.payload];
      } else {
        state.friendRequestDetails = [...state.friendRequestDetails, action.payload];
      }
    },
    
    removeFriendRequestDetails: (state, action: PayloadAction<string | number>) => {
      const requestId = action.payload;
      const filteredRequests = state.friendRequestDetails.filter((r) => r.requestId !== requestId);
      state.friendRequestDetails = filteredRequests;
    },
    
    removeWhileLogout: (state) => {
      state.friendRequestDetails = [];
    },
  },
});

export const { 
  setFriendRequestDetails, 
  removeFriendRequestDetails, 
  addFriendRequestDetails, 
  removeWhileLogout 
} = friendRequestDetailsSlice.actions;

export default friendRequestDetailsSlice.reducer;