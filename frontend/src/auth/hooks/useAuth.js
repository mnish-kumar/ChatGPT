import { useContext, useState } from "react";
import {AuthContext} from "../services/auth.context";
import { login, register, logout } from "../API/auth.api";
import { createChat, getMessages } from "../API/chat.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async ({ email, password }) => {
        setIsSubmitting(true);
        setLoading(true);

        try {
            const data = await login({ email, password });
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error };
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    }

    const handleRegister = async ({ fullname, email, password }) => {
        setIsSubmitting(true);
        setLoading(true);
        
        try {
            const data = await register({ fullname, email, password });
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error("Register failed:", error);
            return { success: false, error };
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setIsSubmitting(true);

        try {
            await logout();
            setUser(null);
        }catch (error) {
            console.error("Logout failed:", error);
        }finally {
            setIsSubmitting(false);
        }
    }
    
    const handleCreateChat = async ({ title }) => {
        try {                
            const data = await createChat({ title });
            return data.chat;
        } catch (error) {
            console.error("Error creating chat:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleGetMessages = async (chatId) => {
        setLoading(true);
        try {
            const data = await getMessages(chatId);

            return data.messages;
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        user,
        loading,
        isSubmitting,
        handleLogin,
        handleRegister,
        handleLogout,
        handleCreateChat,
        handleGetMessages,
    };
}