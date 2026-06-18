"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Check, CircleMinus, Plus } from "lucide-react";
import Image from "next/image";

import createGroup from "@/app/api/createGroup";
import getGroups from "@/app/api/getGroups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { setGroupList } from "@/lib/redux/features/groupSlice";

// --- Types & Interfaces ---
export interface FriendDetails {
  _id: string;
  username: string;
  avatar: string;
}

export interface FriendListItem {
  friend: FriendDetails;
}

export interface RootState {
  friendList: {
    friendList: FriendListItem[];
  };
}

export interface GroupFormData {
  groupName: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const GroupCreationPopOver: React.FC = () => {
  const { friendList } = useSelector((state: RootState) => state.friendList);
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm<GroupFormData>();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const addFriend = (friend: FriendDetails): void => {
    if (!selectedFriends.includes(friend._id)) {
      setSelectedFriends((prev) => [...prev, friend._id]);
    }
  };

  const removeFriend = (friendId: string): void => {
    setSelectedFriends((prev) => prev.filter((id) => id !== friendId));
  };

  const onSubmit: SubmitHandler<GroupFormData> = (data) => {
    const name = data.groupName;
    const members = selectedFriends;

    createGroup(name, members)
      .then((res: string | undefined) => {
        // Handles the possibility of createGroup resolving to undefined
        toast.success(res || "Group Created Successfully");
        
        // This is now 100% type-synchronized with your custom Redux actions
        getGroups().then((groupRes) => {
          dispatch(setGroupList(groupRes));
        });
      })
      .catch((err: ApiError) => {
        const errorMessage =
          err?.response?.data?.message || err?.message || "An error occurred";
        toast.error(errorMessage);
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-900 text-white border-none hover:bg-gray-900 hover:text-purple-500 transition-all duration-200"
        >
          <Plus size={30} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-gray-900 border-white text-white">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-lg">Create Group</h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Input
              {...register("groupName", {
                required: true,
                minLength: {
                  value: 3,
                  message: "Group Name must be at least 3 characters long",
                },
              })}
              type="text"
              className="h-8 outline-none focus:outline-none w-full"
              placeholder="Group Name"
            />
            <div className="flex justify-between items-center w-full mt-3">
              <p className="text-lg">Add Member</p>
            </div>
            <div className="w-full max-h-64 overflow-y-auto">
              {friendList && friendList.length > 0 ? (
                friendList.map(({ friend }) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between border-b p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12">
                        <Image
                          src={friend.avatar}
                          alt={`${friend.username}'s profile`}
                          fill
                          sizes="48px"
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>{friend.username}</div>
                    </div>
                    <div className="flex gap-2">
                      {selectedFriends.includes(friend._id) ? (
                        <>
                          <Check size={20} className="text-purple-500" />
                          <CircleMinus
                            size={20}
                            className="text-red-500 cursor-pointer"
                            onClick={() => removeFriend(friend._id)}
                          />
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
              ) : (
                <div className="p-3 text-gray-400">No Friends Found</div>
              )}
            </div>
            <Button
              type="submit"
              className="mt-4 bg-purple-500 hover:bg-purple-600 transition-all duration-200"
            >
              Create Group
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GroupCreationPopOver;