import axiosInstance from "../util/axiosInstance";

export const CreateItem = async (itemdata) => {

    try {
        const response = await axiosInstance.post('/items/', itemdata);
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

export const GetItems = async (cat_id, scat_id) => {

    try {
        const response = await axiosInstance.get(`/items/?cat_id=${cat_id}&scat_id=${scat_id}`);
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

export const GetCategories = async () => {

    try {
        const response = await axiosInstance.get(`/categories/`);
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

export const GetCategoryByID = async (cat_id) => {

    try {
        const response = await axiosInstance.get(`/categories/?cat_id=${cat_id}`);
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

/* export const GetSubCategories = async () => {

    try {
        const response = await axiosInstance.get(`/categories/sub/`);
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
}; */

export const ChangeItemStatus = async (formdata) => {
    try {
        const response = await axiosInstance.post(`/items/status/`, formdata);
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

export const ChangeCategoryStatus = async (formdata) => {
    try {
        const response = await axiosInstance.post(`/categories/status/`, formdata);
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

export const CheckItemStatus = async (item_id) => {
    try {
        const response = await axiosInstance.get(`/items/status/?item_id=${item_id}`);
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
        const response = await axiosInstance.delete(`/items/?item_id=${item_id}`);
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
