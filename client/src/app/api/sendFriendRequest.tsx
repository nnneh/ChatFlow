import axios, { AxiosError } from "axios";

// ✅ Fixed: use the same env var as the rest of the app
const sendFriendRequest = async (usernameOrId: string): Promise<string> => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/request/sendRequest/${usernameOrId}`,
      {},
      { withCredentials: true }
    );
    return res.data.message;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    if (err.response) {
      throw new Error(err.response.data?.message || "An error occurred on the server.");
    }
    throw new Error("Network error: check your connection.");
  }
};

export default sendFriendRequest;