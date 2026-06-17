import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

interface GroupResponse {
  success?: boolean;
}

const createGroup = async (name: string, members: string[]): Promise<string | undefined> => {
  try {
    const { data } = await axios.post<GroupResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/group/makeGroup`,
      { name, members },
      { withCredentials: true }
    );
    
    if (data) {
      return "Group Created Successfully";
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (axiosError.response) {
      console.log(axiosError.response.data.message);
      return axiosError.response.data.message;
    }
    
    console.error("An unexpected error occurred:", error);
    return "An unexpected error occurred";
  }
};

export default createGroup;