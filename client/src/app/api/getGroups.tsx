import axios, { AxiosError } from "axios";

// 1. Replicating the exact Redux slice interfaces for type-safety
export interface Participant {
  _id: string;
}

export interface ReduxGroup {
  chatId: string | number;
  group: {
    _id?: string;
    name: string;
    createdAt?: string;
    participants: Participant[];
  };
  lastMessage?: {
    sender: string;
    content: string;
  };
}

// 2. Interface matching what your actual backend database/API outputs
interface BackendGroupDetails {
  _id: string;
  name: string;
  members: string[]; // Backend returns an array of string IDs
  createdAt?: string;
}

interface BackendGroupItem {
  chatId: string | number;
  group: BackendGroupDetails;
  lastMessage?: {
    sender: string;
    content: string;
  };
}

interface GetGroupsResponse {
  groups: BackendGroupItem[];
}

interface ApiErrorResponse {
  message: string;
}

const getGroups = async (): Promise<ReduxGroup[]> => {
  try {
    const { data } = await axios.get<GetGroupsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/group`, 
      { withCredentials: true }
    );
    
    const backendGroups = data?.groups ?? [];

    // 3. Map the backend payload data directly into the shape Redux expects
    const transformedGroups: ReduxGroup[] = backendGroups.map((item) => ({
      chatId: item.chatId,
      lastMessage: item.lastMessage,
      group: {
        _id: item.group._id,
        name: item.group.name,
        createdAt: item.group.createdAt,
        // Map backend 'members' string[] into 'participants' object[]
        participants: item.group.members.map((memberId) => ({
          _id: memberId,
        })),
      },
    }));
    
    return transformedGroups;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (axiosError.response) {
      console.log(axiosError.response.data.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    
    return [];
  }
};

export default getGroups;