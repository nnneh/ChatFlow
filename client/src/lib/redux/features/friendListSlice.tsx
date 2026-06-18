import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the internal Friend structure based on your payload usage
interface FriendDetails {
  _id: string;
  isOnline: boolean;
  [key: string]: any; // Allows for other properties like name, avatar, etc.
}

// 2. Define the structure for each item in the friendList
interface FriendListItem {
  chatId: string;
  friend: FriendDetails;
  lastMessage?: any; // Replace 'any' with your Message type if you have one
  [key: string]: any; 
}

// 3. Define the Slice State type
interface FriendListState {
  friendList: FriendListItem[];
}

const initialState: FriendListState = {
  friendList: [],
};

const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    setFriendList: (state, action: PayloadAction<FriendListItem[]>) => {
      state.friendList = action.payload;
    },
    
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
    
    changeFriendListOrder: (state, action: PayloadAction<string>) => {
      const messagingFriend = state.friendList.find(
        (f) => f?.chatId === action.payload
      );

      // Early return or guard if the friend isn't found to avoid pushing 'undefined'
      if (!messagingFriend) return;

      const newFriendList = state.friendList.filter(
        (friend) => friend?.chatId !== action.payload
      );

      state.friendList = [messagingFriend, ...newFriendList];
    },
    
    updateLastMessage: (
      state,
      action: PayloadAction<{ chatId: string; lastMessage: any }> // Replace 'any' with your Message type
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
    
    addFriendFromSocket: (state, action: PayloadAction<FriendListItem>) => {
      state.friendList = [...state.friendList, action.payload];
    },
    
    removeFriendFromSocket: (state, action: PayloadAction<string>) => {
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



// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// // ✅ Import Friend from getUserDetails — single source of truth
// import { Friend } from "@/app/api/getUserDetails";

// // Re-export so other components can do: import { Friend } from here if needed
// export type { Friend };

// interface FriendListState {
//   friends: Friend[];
// }

// const initialState: FriendListState = {
//   friends: [],
// };

// export const friendListSlice = createSlice({
//   name: "friendList",
//   initialState,
//   reducers: {
//     // ✅ Replaces the full list instead of accumulating
//     // This prevents stale friends from persisting after a refresh
//     setFriends: (state, action: PayloadAction<Friend[]>) => {
//       state.friends = action.payload;
//     },

//     addFriend: (state, action: PayloadAction<Friend>) => {
//       // ✅ Guard against duplicates before pushing
//       const exists = state.friends.some((f) => f._id === action.payload._id);
//       if (!exists) {
//         state.friends.push(action.payload);
//       }
//     },

//     removeFriend: (state, action: PayloadAction<string>) => {
//       state.friends = state.friends.filter((f) => f._id !== action.payload);
//     },

//     clearFriendsWhileLogout: (state) => {
//       state.friends = [];
//     },
//   },
// });

// export const {
//   setFriends,
//   removeFriend,
//   addFriend,
//   clearFriendsWhileLogout,
// } = friendListSlice.actions;

// export default friendListSlice.reducer;