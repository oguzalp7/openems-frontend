"use client"

import { createContext, useState } from "react";
import { apiClient } from "@/apiClient";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const toast = useToast();

    const login = async (username, password) => {
        const data = new URLSearchParams();
        data.append("grant_type", "");
        data.append("username", username);
        data.append("password", password);
        data.append("scope", "");
        data.append("client_id", "");
        data.append("client_secret", "");
        try {
            const response = await apiClient.post("/auth/token", data, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            });
            console.log(response.data)
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data)
            router.push('/dashboard/home')
        } catch (error) {
            console.log(error)
            toast({
                title: 'Giriş Başarısız.',
                description: error.response.data.detail,
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
        
    };
    const logout = () => {
        setUser(null);
        delete apiClient.defaults.headers.common['Authorization']
        router.push('/login')
    };

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;