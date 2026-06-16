import axios from "axios";

const getReceivedRequests = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request/allrequest`, {
      withCredentials: true,
    });
    return res.data.request ?? [];
  } catch (error: any) {
    console.error("getReceivedRequests error:", error.response?.data || error.message);
    return [];
  }
};

export default getReceivedRequests;