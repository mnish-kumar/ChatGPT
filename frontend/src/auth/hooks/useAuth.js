import { useContext, useState } from "react";
import {AuthContext} from "../services/auth.context";
import { login, register, logout } from "../API/auth.api";

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

    return {
        user,
        loading,
        isSubmitting,
        handleLogin,
        handleRegister,
        handleLogout
    };
}