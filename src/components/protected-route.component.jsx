"use client"

import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"
import AuthContext from "@/context/AuthContext";
import Navbar from "./navbar.component";
import { Stack, Flex } from "@chakra-ui/react";

const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    const router = useRouter();
    

    useEffect(() => {
        if(!user){
            router.push('/login');
        }
    }, [user, router]);

    return user ? (
        <Stack flexDir={'column'}>
            <Navbar/>
            <Flex as="main" flex="1" justify="center" align="center" w={'full'}>
                {children}
            </Flex>
        </Stack>
    ) : null;
}

export default ProtectedRoute;