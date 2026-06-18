"use client";

import FriendCard from "@/components/search-user/FriendCard";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState, ChangeEvent } from "react";
import toast from "react-hot-toast";

// 1. Define the interface for the User objects returned by your API
interface User {
  _id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
}

// 2. Define the expected shape of the API response
interface ApiResponse {
  user: User[];
}

// ✅ Renamed from Search to SearchPage to prevent duplicate identifier errors
const SearchPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  // Type the state array as User[]
  const [users, setUsers] = useState<User[]>([]);

  // Streamlined the filter logic to return a boolean directly
  const searchedUser = users.filter((user) => 
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const getAllUsers = async (): Promise<void> => {
      try {
        const res = await axios.get<ApiResponse>(
          (process.env.NEXT_PUBLIC_API_URL || "") + "user/users",
          { withCredentials: true }
        );
  
        // res.data is now typed as ApiResponse, so .user is recognized safely
        setUsers(res.data.user);
      } catch (error) {
        toast.error("An error occurred");
        console.error(error);
      }
    };

    getAllUsers();
  }, []);

  // Explicitly typed the input change event
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <div className="h-screen flex flex-col items-center gap-4 w-screen bg-gray-900 font-sans overflow-auto">
      <div className="relative w-96 top-4">
        <input
          type="text"
          value={search}
          placeholder="Search..."
          className="w-full h-12 border focus:outline-none focus:border-purple-500 transition-all duration-100 border-purple-500 rounded-2xl pr-10 p-2 text-white text-lg"
          onChange={handleSearchChange}
        />
        <div className="absolute flex items-center right-2 top-2">
          <SearchIcon size={34} className="text-purple-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 w-[85%] h-28">
        {searchedUser.length > 0 ? (
          searchedUser.map((friend) => (
            <FriendCard key={friend._id} {...friend} />
          ))
        ) : (
          <div className="text-4xl text-gray-400 w-full text-center col-span-full">
            No Users Found
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;