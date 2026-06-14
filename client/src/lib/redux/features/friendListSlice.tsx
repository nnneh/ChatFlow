import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the nested structure for the actual friend profile
interface FriendProfile {
  _id: string;
  isOnline: boolean;
  // add username, avatar, etc., if needed
}

// 2. Define the main structure of an item in your friendList array
interface FriendItem {
  chatId: string | number;
  friend: FriendProfile;
  lastMessage?: string | object; // Adjust based on your message structure
}

// 3. Define the structure of the slice's state
interface FriendListState {
  friendList: FriendItem[];
}

const initialState: FriendListState = {
  friendList: [],
};

const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    // Expects an entire array of friend items
    setFriendList: (state, action: PayloadAction<FriendItem[]>) => {
      state.friendList = action.payload;
    },

    // Expects an object containing userId and online status
    updateFriendOnlineStatus: (
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean }>
    ) => {
      state.friendList = state.friendList.map((friend) => {
        if (friend?.friend?._id === action.payload?.userId) {
          return {
            ...friend,
            friend: { ...friend.friend, isOnline: action.payload?.isOnline },
          };
        }
        return friend;
      });
    },

    // Expects just the chatId (string or number) to move to the front
    changeFriendListOrder: (state, action: PayloadAction<string | number>) => {
      const messagingFriend = state.friendList.find(
        (f) => f?.chatId === action.payload
      );

      const newFriendList = state.friendList.filter(
        (friend) => friend?.chatId !== action.payload
      );

      // Only reorder if the friend was actually found, to avoid pushing undefined
      if (messagingFriend) {
        state.friendList = [messagingFriend, ...newFriendList];
      }
    },

    // Expects the chatId and the new last message contents
    updateLastMessage: (
      state,
      action: PayloadAction<{ chatId: string | number; lastMessage: any }>
    ) => {
      const { chatId, lastMessage } = action.payload;
      state.friendList = state.friendList.map((friend) => {
        if (friend?.chatId === chatId) {
          return {
            ...friend,
            lastMessage,
          };
        }
        return friend;
      });
    },

    // Expects a single complete FriendItem object
    addFriendFromSocket: (state, action: PayloadAction<FriendItem>) => {
      state.friendList = [...state.friendList, action.payload];
    },

    // Expects a chatId to remove
    removeFriendFromSocket: (state, action: PayloadAction<string | number>) => {
      state.friendList = state.friendList.filter((f) => f.chatId !== action.payload);
    },

    removeFriendList: (state) => {
      state.friendList = [];
    },
  },
});

export const {
  setFriendList,
  removeFriendList,
  updateFriendOnlineStatus,
  changeFriendListOrder,
  updateLastMessage,
  addFriendFromSocket,
  removeFriendFromSocket,
} = friendListSlice.actions;

export default friendListSlice.reducer;