"use client"

import React, {useState, useEffect, useContext} from 'react'
import { apiClient } from '@/apiClient'
import Loading from '@/components/loading.component'

import ProtectedRoute from '@/components/protected-route.component'
import AuthContext from '@/context/AuthContext'

import {
    Box,
    useToast,
} from '@chakra-ui/react'

const MSPage = () => {

    const {user} = useContext(AuthContext);

    const [events, setEvents] = useState([]);

    


    return(
        <ProtectedRoute>
            <div>YAKINDA...</div>
        </ProtectedRoute>
        
    );
}

export default MSPage;