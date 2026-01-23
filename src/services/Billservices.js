import axiosInstance from "../util/axiosInstance";
import { getToken } from "../util/Cookies";

export const CreateBill = async (cartdata) => {
    const token = getToken();
    try {
        const response = await axiosInstance.post('/bills/add/', cartdata, {
            method: "POST",
            headers: {
                Authorization: `${token}`,
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};

export const GetOrders = async (searchData) => {
    const queryString = new URLSearchParams(searchData).toString();
    try {
        const response = await axiosInstance.get(`/bills/?${queryString}`);
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

export const ChangeOrderStatus = async (formdata) => {
    try {
        const response = await axiosInstance.post(`/bills/status/`, formdata);
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