import axios from "axios";

const getSentRequests = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request/sentrequests`, {
      withCredentials: true,
    });
    return res.data.request ?? [];
  } catch (error: any) {
    console.error("getSentRequests error:", error.response?.data || error.message);
    return [];
  }
};

export default getSentRequests;