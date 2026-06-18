import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Participant {
  _id: string;
}

interface Group {
  chatId: string | number;
  group: {
    participants: Participant[];
  };
  lastMessage?: {
    sender: string;
    content: string;
  };
}

interface GroupListState {
  groupList: Group[];
}

const initialState: GroupListState = {
  groupList: [],
};

export const groupListSlice = createSlice({
  name: "groupList",
  initialState,
  reducers: {
    setGroupList: (state, action: PayloadAction<Group[]>) => {
      state.groupList = action.payload;
    },
    
    updateGroupListOrder: (state, action: PayloadAction<string | number>) => {
      const chatId = action.payload;
      const chat = state.groupList.find((c) => c?.chatId === chatId);

      if (!chat) return;

      const newList = state.groupList.filter((c) => c?.chatId !== chatId);
      state.groupList = [chat, ...newList];
    },

    updateLastMessageGroup: (
      state,
      action: PayloadAction<{ chatId: string | number; sender: string; content: string }>
    ) => {
      const { chatId, sender, content } = action.payload;
      state.groupList = state.groupList.map((group) => {
        if (group?.chatId === chatId) {
          return {
            ...group,
            lastMessage: { ...group?.lastMessage, sender, content },
          };
        }
        return group;
      });
    },

    addGroupList: (state, action: PayloadAction<Group>) => {
      state.groupList = [...state.groupList, action.payload];
    },

    groupRemoveAfterDeletion: (state, action: PayloadAction<string | number>) => {
      const chatId = action.payload;
      const filteredGroupList = state.groupList.filter((g) => g?.chatId !== chatId);
      state.groupList = filteredGroupList;
    },

    groupMemberCountUpdate: (
      state,
      // 1. Changed memberID type from string to string[]
      action: PayloadAction<{ groupID: string | number; memberID: string[]; isAdd: boolean }>
    ) => {
      const { groupID, memberID, isAdd } = action.payload;
      
      if (isAdd) {
        state.groupList = state.groupList.map((g) => {
          if (g.chatId === groupID) {
            // 2. Loop through the array of incoming member IDs
            memberID.forEach((id) => {
              // Only push if the participant isn't already in the group
              if (!g.group.participants.some(p => p._id === id)) {
                g.group.participants.push({ _id: id });
              }
            });
            return g;
          }
          return g;
        });
      } else {
        state.groupList = state.groupList.map((g) => {
          if (g.chatId === groupID) {
            // 3. Filter out all participants whose IDs are included in the memberID array
            g.group.participants = g.group.participants.filter((p) => !memberID.includes(p._id));
            return g;
          }
          return g;
        });
      }
    },
    
    removeGroupList: (state) => {
      state.groupList = [];
    },
  },
});

export const {
  setGroupList,
  updateGroupListOrder,
  updateLastMessageGroup,
  removeGroupList,
  addGroupList,
  groupRemoveAfterDeletion,
  groupMemberCountUpdate,
} = groupListSlice.actions;

export default groupListSlice.reducer;