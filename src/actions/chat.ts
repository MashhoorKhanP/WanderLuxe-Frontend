import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchData from "./utils/fetchData";
import errorHandle from "../components/hooks/errorHandler";
import { AxiosError } from "axios";

interface AddMessageData {
  sender: string;
  text: string;
  conversationId: string;
}

export interface ConversationData {
  senderId:string;
  receiverId:string;
}

export const getConversations = createAsyncThunk(
  "adminORUser/getConversations",
  async (userId: string) => {
    try {
      const result = await fetchData({
        url:
          import.meta.env.VITE_SERVER_URL +
          `/api/user/get-conversations/${userId}`,
        method: "GET",
      });
      if (result?.data && result.data.message) {
        // If there is an error message, throw an error to trigger the rejected action
        throw new Error(result.data.message);
      }
      // If no error message, return the result
      return result;
    } catch (error) {
      const typedError = error as Error | AxiosError;

      console.error("Error getAdminConversations :", typedError);
      // errorHandle(typedError);
      console.error("Error getAdminConversations :", error);
      throw error;
    }
  }
);

export const getMessages = createAsyncThunk(
  "adminORUser/getAdminMessages",
  async (conversationId: string) => {
    try {
      const result = await fetchData({
        url:
          import.meta.env.VITE_SERVER_URL +
          `/api/user/get-message/${conversationId}`,
        method: "GET",
      });
      if (result?.data && result.data.message) {
        // If there is an error message, throw an error to trigger the rejected action
        throw new Error(result.data.message);
      }
      // If no error message, return the result
      return result;
    } catch (error) {
      const typedError = error as Error | AxiosError;

      console.error("Error getAdminConversations :", typedError);
      errorHandle(typedError);
      console.error("Error getAdminConversations :", error);
      throw error;
    }
  }
);

export const addNewMessage = createAsyncThunk(
  "adminORuser/postAddMessage",
  async (messageData: AddMessageData) => {
    try {
      const result = await fetchData({
        url: import.meta.env.VITE_SERVER_URL + `/api/user/add-message`,
        method: "POST",
        body: messageData,
      });
      if (result?.data && result.data.message) {
        // If there is an error message, throw an error to trigger the rejected action
        throw new Error(result.data.message);
      }
      // If no error message, return the result
      return result;
    } catch (error) {
      const typedError = error as Error | AxiosError;

      console.error("Error getAdminConversations :", typedError);
      errorHandle(typedError);
      console.error("Error getAdminConversations :", error);
      throw error;
    }
  }
);

export const addNewConversation = createAsyncThunk(
  "adminORuser/postAddNewConversation",
  async (conversationData: ConversationData) => {
    try {
      const result = await fetchData({
        url: import.meta.env.VITE_SERVER_URL + `/api/user/conversation`,
        method: "POST",
        body: conversationData,
      });
      if (result?.data && result.data.message) {
        // If there is an error message, throw an error to trigger the rejected action
        throw new Error(result.data.message);
      }
      // If no error message, return the result
      return result;
    } catch (error) {
      const typedError = error as Error | AxiosError;

      console.error("Error getAdminConversations :", typedError);
      errorHandle(typedError);
      console.error("Error getAdminConversations :", error);
      throw error;
    }
  }
);
