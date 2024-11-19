"use client"

import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"
import AuthContext from "@/context/AuthContext";
import Navbar from "./navbar.component";
import { Stack, Flex } from "@chakra-ui/react";
import Sidebar from "./sidebar.component";
import {  Text, IconButton } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'

const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    const router = useRouter();
    

    useEffect(() => {
        if(!user){
            router.push('/login');
        }
    }, [user, router]);

    return user ? (
        <>
        <Flex w="100%">
            <Sidebar />
            <Stack maxHeight={"150vh"} flexDir={'column'} justify="center" align="center" w={'full'}>
            <Navbar/>
            {/* <Sidebar/> */}
            <Flex as="main" flex="1" justify="center" align="center" w={'full'}>
                {children}
            </Flex>
        </Stack>
        </Flex>
        
        </>
        
    ) : null;
}

export default ProtectedRoute;

/*


*/