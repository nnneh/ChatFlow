import axios from "axios";

const getFriends = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friend`, {
      withCredentials: true,
    });

    console.log("Full response:", res.data);
    return res.data.Friends ?? res.data.friends ?? res.data ?? [];
  } catch (error: any) {
    if (error.response) {
      console.log("Server Error Status:", error.response.status);
      console.log("Server Error Data:", error.response.data);
    } else {
      console.log("Network Connection Error:", error.message);
    }
    return [];
  }
};