import axiosInstance from "../util/axiosInstance";

export const verifyUser = async (mobile) => {
    try {
        const response = await axiosInstance.post("/users/verify/", { mobile });
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};
export const verifyAdmin = async (mobile, password) => {
    try {
        const response = await axiosInstance.post("/users/admin/verify/", { mobile, password });
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};