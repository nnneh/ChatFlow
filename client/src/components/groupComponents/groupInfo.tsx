"use client";

import React from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdAdminPanelSettings } from "react-icons/md";
import { Minus } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddMembers from "./addMembers";
import removeGroupMember from "@/app/api/removeGroupMember";
import leaveGroup from "@/app/api/leaveGroup";
import groupDeletion from "@/app/api/deleteGroup";
import getGroups from "@/app/api/getGroups";
import { setGroupList } from "@/lib/redux/features/groupSlice";


export interface GroupParticipant {
  _id: string;
  username: string;
  avatar: string;
  email: string;
}

export interface SelectGroupDetails {
  _id: string;
  groupName: string;
  groupAdmin: string;
  participants: GroupParticipant[];
}

interface GroupInfoPopOverProps {
  selectGroup: SelectGroupDetails;
  chatId: string | number;
}

interface UserInfo {
  _id: string;
  username?: string;
  email?: string;
}

interface RootState {
  userInfo: {
    userInfo: UserInfo;
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const GroupInfoPopOver: React.FC<GroupInfoPopOverProps> = ({ selectGroup, chatId }) => {
  const { userInfo } = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();

  const handleRemoveMember = (memberId: string): void => {
    removeGroupMember({ groupID: chatId, memberID: memberId })
      .then((res: string) => {
        toast.success(res || "Member removed");
      })
      .catch((err: ApiError | any) => {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to remove member";
        toast.error(errorMsg);
      });
  };

  const handleLeaveGroup = (groupId: string | number): void => {
    leaveGroup(groupId)
      .then((res: string) => {
        toast.success(res || "Left the group");
      })
      .catch((err: ApiError | any) => {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to leave group";
        toast.error(errorMsg);
      });
  };

  const handleGroupDeletion = (groupId: string | number): void => {
    groupDeletion(groupId)
      .then((res: string) => {
        toast.success(res || "Group deleted");
        getGroups().then((groupRes) => dispatch(setGroupList(groupRes)));
      })
      .catch((err: ApiError | any) => {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to delete group";
        toast.error(errorMsg);
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 text-pink-500 hover:text-pink-600 bg-pink-50 rounded-xl transition-all duration-200 outline-none focus:ring-0">
          <BsFillInfoCircleFill size={18} />
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 bg-white/95 backdrop-blur-md border border-pink-100 rounded-2xl shadow-lg max-h-[80vw] p-4 overflow-hidden text-slate-800">
        <div className="flex flex-col h-full space-y-3">
          
          {/* Header Layout (Matches Header title layout) */}
          <div className="flex items-center justify-between border-b border-pink-100/40 pb-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-800 truncate max-w-[150px]">
              {selectGroup?.groupName}
            </h1>
            {userInfo?._id === selectGroup?.groupAdmin ? (
              <Button 
                onClick={() => handleGroupDeletion(chatId)} 
                className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 h-7 rounded-xl transition-all duration-200 px-2.5 shadow-none"
              >
                Delete Group
              </Button>
            ) : (
              <Button
                onClick={() => handleLeaveGroup(chatId)}
                className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 h-7 rounded-xl transition-all duration-200 px-3 shadow-none"
              >
                Leave
              </Button>
            )}
          </div>

          {/* Members Title Area */}
          <div className="flex justify-between items-center px-0.5">
            <p className="text-sm font-semibold text-slate-500">Members</p>
            <AddMembers chatId={chatId} />
          </div>

          {/* Container List Box (Matches GroupList styling system) */}
          <div className="space-y-1 overflow-y-auto pr-0.5 max-h-[50vh]">
            {selectGroup?.participants?.map((p) => {
              const isUserAdmin = selectGroup?.groupAdmin === p?._id;
              
              return (
                <div
                  key={p?._id}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-slate-50 border border-transparent hover:border-slate-100/50 group"
                >
                  {/* Participant Avatar */}
                  <div className="relative h-9 w-9 shrink-0">
                    <Image
                      src={p?.avatar || "/default-avatar.png"}
                      alt={`${p?.username || "user"}'s profile`}
                      fill
                      sizes="36px"
                      className="rounded-full object-cover border border-pink-100/40"
                    />
                  </div>

                  {/* Profile Info Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-semibold text-slate-700 truncate">
                        {p?.username}
                      </h2>
                      {isUserAdmin && (
                        <MdAdminPanelSettings
                          size={16}
                          className="text-pink-500 shrink-0"
                          title="Admin"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {p?.email}
                    </p>
                  </div>

                  {/* Remove Button Actions */}
                  <div className="shrink-0 flex items-center">
                    {selectGroup?.groupAdmin === userInfo?._id && !isUserAdmin && (
                      <Button
                        onClick={() => handleRemoveMember(p?._id)}
                        className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 p-0 h-7 w-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 border border-red-100 shadow-none"
                        title="Remove Member"
                      >
                        <Minus size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GroupInfoPopOver;