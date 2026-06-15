import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Friend {
  friendId: string | number;
  name: string;
  avatar?: string;
}

interface FriendListState {
  friends: Friend[];
}

const initialState: FriendListState = {
  friends: [],
};

export const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      const nonDuplicateFriends = action.payload.filter(
        (f) => !state.friends.some((friend) => friend.friendId === f.friendId)
      );
      state.friends = [...state.friends, ...nonDuplicateFriends];
    },
    
    addFriend: (state, action: PayloadAction<Friend>) => {
      if (state.friends.length === 0) {
        state.friends = [action.payload];
      } else {
        state.friends = [...state.friends, action.payload];
      }
    },
    
    removeFriend: (state, action: PayloadAction<string | number>) => {
      const friendId = action.payload;
      const filteredFriends = state.friends.filter((f) => f.friendId !== friendId);
      state.friends = filteredFriends;
    },
    
    clearFriendsWhileLogout: (state) => {
      state.friends = [];
    },
  },
});

export const { 
  setFriends, 
  removeFriend, 
  addFriend, 
  clearFriendsWhileLogout 
} = friendListSlice.actions;

export default friendListSlice.reducer;