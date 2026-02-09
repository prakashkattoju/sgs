import axiosInstance from "../util/axiosInstance";


export const CreateItem = async (itemdata) => {

    try {
        const response = await axiosInstance.post('/dashboard/', itemdata);
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

export const GetColumns = async (column) => {
    try {
        const response = await axiosInstance.get(`/dashboard/?column=${column}`);
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

export const GetColumnIds = async (column_id) => {
    try {
        const response = await axiosInstance.get(`/dashboard/?column_id=${column_id}`);
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

export const GetAllItems = async (searchData) => {
    const queryString = new URLSearchParams(searchData).toString();
    try {
        const response = await axiosInstance.get(`/dashboard/?${queryString}`);
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

export const DeleteItemByID = async (item_id) => {
    try {
        const response = await axiosInstance.delete(`/dashboard/?item_id=${item_id}`);
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