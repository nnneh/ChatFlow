"use client";

import addGroupMember from "@/app/api/addGroupMember";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { groupMemberCountUpdate } from "@/lib/redux/features/groupSlice";
import { Check, CircleMinus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// Blueprint for Friend data structure
interface Friend {
  _id: string;
  avatar: string;
  username: string;
}

// Map the shape of your Redux slice
interface RootState {
  friendList: {
    friendList: Array<{ friend: Friend }>;
  };
}

interface AddMembersProps {
  chatId: string;
}

const AddMembers = ({ chatId }: AddMembersProps) => {
  const { friendList } = useSelector((state: RootState) => state.friendList);
  const dispatch = useDispatch();

  const { handleSubmit } = useForm();
  
  // State typed to specifically accept an array of Friend objects
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  // Derived state: Use a Set of IDs for O(1) performance lookups during rendering
  const selectedFriendIds = new Set(selectedFriends.map((f) => f._id));

  const addFriend = (friend: Friend) => {
    if (!selectedFriendIds.has(friend._id)) {
      setSelectedFriends((prev) => [...prev, friend]);
    }
  };

  const removeFriend = (friendId: string) => {
    setSelectedFriends((prev) => prev.filter((f) => f._id !== friendId));
  };

  const onSubmit = async () => {
    const groupID = chatId;
    // Map objects down to an array of pure ID strings to match your API signature
    const memberID: string[] = selectedFriends.map((f) => f._id);

    if (memberID.length === 0) {
      toast.error("Please pick at least one friend to add!");
      return;
    }

    addGroupMember(groupID, memberID)
      .then((res) => {
        toast.success(typeof res === "string" ? res : "Members added successfully!");
        dispatch(groupMemberCountUpdate({ groupID, memberID, isAdd: true }));
        setSelectedFriends([]); // Flush selections out on success
      })
      .catch((err: unknown) => {
        const errorMsg = err instanceof Error ? err.message : String(err);
        toast.error(errorMsg || "Failed to add member");
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="text-white bg-purple-500 border-none hover:bg-purple-600 transition-all duration-300"
        >
          <Plus size={30} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-gray-900 border-white text-white">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-2xl">Friends</h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="w-full max-h-64 overflow-y-auto">
              {friendList && friendList.length > 0
                ? friendList.map(({ friend }) => (
                    <div
                      key={friend._id}
                      className="flex items-center justify-between border-b p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <Image
                            src={friend.avatar || "/default-avatar.png"}
                            height={50}
                            width={50}
                            alt="Profile_image"
                            className="rounded-full h-12 w-12 object-cover"
                          />
                        </div>
                        <div>{friend.username}</div>
                      </div>
                      <div className="flex gap-2">
                        {selectedFriendIds.has(friend._id) ? (
                          <>
                            <Check size={20} className="text-purple-500" />
                            <button
                              type="button"
                              onClick={() => removeFriend(friend._id)}
                              className="focus:outline-none"
                            >
                              <CircleMinus size={20} className="text-red-500" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addFriend(friend)}
                            className="focus:outline-none"
                          >
                            <Plus size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                : "No Friends Found"}
            </div>
            <Button
              type="submit"
              className="mt-4 w-full bg-purple-500 hover:bg-purple-600 transition-all duration-200"
              disabled={selectedFriends.length === 0}
            >
              Add Member
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddMembers;