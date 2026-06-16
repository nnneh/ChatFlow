import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

interface LeaveGroupResponse {
  success?: boolean;
  message?: string;
}

const leaveGroup = async (groupID: string): Promise<string | undefined> => {
  try {
    const { data } = await axios.delete<LeaveGroupResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/group/leaveGroup/${groupID}`,
      { withCredentials: true }
    );

    if (data) {
      return "Left SuccessFully";
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      console.log(axiosError.response.data.message);
      return axiosError.response.data.message;
    }
    console.error("An unexpected error occurred:", error);
    return "An unexpected error occurred while leaving the group";
  }
};

export default leaveGroup;