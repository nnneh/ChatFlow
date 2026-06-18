import axios from "axios";

const addGroupMember = async (groupID: string, memberID: string[]) => {
    try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/group/addMember`,
          { groupID, memberID },
          { withCredentials: true }
        );
        if (data) {
          // return "Added SuccessFully"
          return data?.message
        }
      } catch (error: unknown) {
    // Narrowing 'unknown' error down to safely access '.message'
    if (error instanceof Error) {
      console.error("API Error message:", error.message);
      throw new Error(error.message);
    }
    
    console.error("An unexpected error occurred:", error);
    throw new Error("An unexpected error occurred while adding group members.");
  }
}


export default addGroupMember