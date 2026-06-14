import axios from "axios";

const sendFriendRequest = async (_id) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/request/sendRequest/${_id}`,
      {},
      { withCredentials: true }
    );

    if (res.data) {
      return res.data.message;
    }
  } catch (error: any) {
    // Check if error response exists first to prevent crashes
    if (error.response) {
      if (error.response.status === 409) {
        return error.response.data.message;
      }
      return error.response.data.message || "An error occurred on the server.";
    }
    
    console.error(error);
    return "Network error: check your connection.";
  }
}

export default sendFriendRequest;