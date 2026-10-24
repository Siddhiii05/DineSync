import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const login = async (email, password) => {
        try{
            setLoading(true);
            const res = await api.post("/auth/login", {email,password});
            const {token: usertoken, ...userData} = res.data;

            localStorage.setItem("token", usertoken);
            setToken(usertoken);
            setUser(userData);
            toast.success("Login successful!");
            return true;
        }
        catch(error){
            toast.error(
                error.response?.data?.message || "Login failed. Please try again."
            );
        }
        finally{
            setLoading(false)
        }
    };

    const register = async (name, email, password, phone, role) => {
        try{
            setLoading(true);
            const res = await api.post("/auth/register", {name, email, password, phone, role});
            const {token: usertoken, ...userData} = res.data;

            localStorage.setItem("token", usertoken);
            setToken(usertoken);
            setUser(userData);
            toast.success("Registered successfully!");
            return true;
        }
        catch(error){
            toast.error(
                error.response?.data?.message || "Login failed. Please try again."
            );
        }
        finally{
            setLoading(false)
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = "/";
    };

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try{
                    const res = await api.post('/auth/me');
                    setUser(res.data)
                }
                catch(error){
                    console.error(error);
                    logout()
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useAppContext must be used within AppContextProvider"
        );
    }

    return context;
};