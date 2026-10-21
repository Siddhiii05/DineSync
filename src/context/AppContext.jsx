import React, { createContext, useContext, useState, useEffect } from "react";
import { dummyUser } from "../assets/assets.js";

const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const login = async (email, password) => {
        console.log(email, password);

        setToken(dummyUser.token);
        setUser(dummyUser);
        localStorage.setItem("token", dummyUser.token);

        return true;
    };

    const register = async (name, email, password, phone, role) => {
        console.log(name, email, password, phone, role);

        setToken(dummyUser.token);
        setUser(dummyUser);
        localStorage.setItem("token", dummyUser.token);

        return true;
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
                setUser(dummyUser);
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