import axiosInstance from "../util/axiosInstance";

export const GetUserByID = async (user_id) => {
    try {
        const response = await axiosInstance.get(`/users/?user_id=${user_id}`);
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

export const UpdateUserName = async (uname, user_id) => {
    try {
        const response = await axiosInstance.post("/users/updatename/", { uname, user_id });
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

export const GetAllUsers = async () => {
    try {
        const response = await axiosInstance.get(`/users/all/`);
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

export const DeleteUserByID = async (user_id) => {
    try {
        const response = await axiosInstance.delete(`/users/?user_id=${user_id}`);
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
