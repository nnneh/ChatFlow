import axios, { AxiosError } from "axios";

interface RemoveMemberPayload {
  groupID: string;
  memberID: string;
}

interface ApiErrorResponse {
  message: string;
}

interface RemoveMemberResponse {
  success?: boolean;
}

const removeGroupMember = async ({ groupID, memberID }: RemoveMemberPayload): Promise<string | undefined> => {
  try {
    const { data } = await axios.post<RemoveMemberResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/group/removeMember`,
      { groupID, memberID }, 
      { withCredentials: true }
    );
    
    if (data) {
      return "Removed SuccessFully";
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      console.log(axiosError.response.data.message);
      return "Some Error Occurred";
    }
    console.error("An unexpected error occurred:", error);
    return "A network error occurred";
  }
};

export default removeGroupMember;