const API = process.env.NEXT_PUBLIC_API_URL;

export type Friend = {
  _id: string;       
  username: string;
  email: string;
  avatar?: string;
  online?: boolean;  
};

export type FriendListItem = {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

export type PendingRequest = {
  id: string;
  username: string;
  avatar?: string;
  time: string;
};

export type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
};

export type UserProfile = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
};

export type ActiveView = "chat" | "profile";
export type ActiveTab = "friends" | "sent" | "received";

export const apiFetch = async (url: string, opts?: RequestInit) => {
  const res = await fetch(url, { credentials: "include", ...opts });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed (" + res.status + ")");
  }
  return res.json();
};

export const getFriends = async (): Promise<Friend[]> => {
  try {
    const data = await apiFetch(API + "/friend");
    return data.Friends ?? [];
  } catch {
    return [];
  }
};

export const getSentRequests = async (): Promise<PendingRequest[]> => {
  try {
    const data = await apiFetch(API + "/request/sentrequests");
    return (data.request ?? []).map((r: any) => ({
      id: r.requestId,
      username: r.receiver.username,
      avatar: r.receiver.avatar || "",
      time: new Date(r.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch {
    return [];
  }
};

export const getReceivedRequests = async (): Promise<PendingRequest[]> => {
  try {
    const data = await apiFetch(API + "/request/allrequest");
    return (data.request ?? []).map((r: any) => ({
      id: r.requestId,
      username: r.sender.username,
      avatar: r.sender.avatar || "",
      time: new Date(r.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch {
    return [];
  }
};

export const sendFriendRequest = async (username: string): Promise<string> => {
  const data = await apiFetch(
    API + "/request/sendRequest/" + encodeURIComponent(username),
    { method: "POST" }
  );
  return data.message ?? "Request sent";
};

export const acceptRequest = async (id: string) =>
  apiFetch(API + "/request/acceptRequest/" + id, { method: "POST" });

export const rejectRequest = async (id: string) =>
  apiFetch(API + "/request/rejectRequest/" + id, { method: "POST" });

export const getMyProfile = async (): Promise<UserProfile | null> => {
  try {
    const data = await apiFetch(API + "/user/me");
    return data.user ?? data ?? null;
  } catch {
    return null;
  }
};

export const updateProfile = async (payload: {
  username?: string;
  bio?: string;
}): Promise<UserProfile> => {
  const data = await apiFetch(API + "/user/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return data.user ?? data;
};

export const logoutUser = async () =>
  apiFetch(API + "/user/logout", { method: "POST" });