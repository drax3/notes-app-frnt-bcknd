import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() =>
        authTokens ? JSON.parse(atob(authTokens.access.split(".")[1])) : null
    );

    const loginUser = async (email, password) => {
        try {
            const response = await api.post("token/", { email, password });

            setAuthTokens(response.data);
            setUser(JSON.parse(atob(response.data.access.split(".")[1])));
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            return true;
        } catch (err) {
            return false;
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
