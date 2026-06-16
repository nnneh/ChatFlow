import axios, { AxiosError } from "axios";

interface Group {
  _id: string; // or id: number
  name: string;
  members: string[]; 
  createdAt?: string;
}

interface GetGroupsResponse {
  groups: Group[];
}

interface ApiErrorResponse {
  message: string;
}

const getGroups = async (): Promise<Group[]> => {
    try {
      const { data } = await axios.get<GetGroupsResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/group`, 
        { withCredentials: true }
      );
      
      return data?.groups ?? [];
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