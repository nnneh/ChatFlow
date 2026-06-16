import axios, { AxiosError } from "axios";

interface DeleteGroupResponse {
  message: string;
}

interface ApiErrorResponse {
  message: string;
}

const groupDeletion = async (groupId: string): Promise<string | undefined> => {
  try {
    // Pass DeleteGroupResponse as a generic to type the returned 'data'
    const { data } = await axios.delete<DeleteGroupResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/group/deleteGroup/${groupId}`,
      { withCredentials: true }
    );

    if (data) {
        return data.message; // Optional chaining (?.) is no longer needed since message is typed
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
        return axiosError.response.data.message;
    }
    console.error("An unexpected error occurred:", error);
    return "An unexpected error occurred during deletion";
  }
};

export default groupDeletion;