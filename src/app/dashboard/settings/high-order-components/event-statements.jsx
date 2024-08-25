"use client"

import React, {useState, useEffect, useContext} from 'react'
import { apiClient } from '@/apiClient'
import Loading from '@/components/loading.component'

import ProtectedRoute from '@/components/protected-route.component'
import AuthContext from '@/context/AuthContext'

import DatePicker from '@/components/date-picker.component'
import ChakraDropdown from '@/components/dropdown.component'
import { convertDateToTimestamp } from '@/utils'
import { Box, VStack, Stack } from '@chakra-ui/react'

const EventStatements = () => {

    const {user} = useContext(AuthContext);

    // Calculate the first day of the year
    const dateArray = new Date().toISOString().split('T')[0].split("-")
    const currentYear = dateArray[0];
    const currentMonth = dateArray[1];

    const targetStart = `${currentYear}-${currentMonth}-01`
    
            
    const [selectedStartDate, setSelectedStartDate] = useState(targetStart);
    const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    const [data, setData] = useState([])
    const [fetchUrl, setFetchUrl] = useState(`/payments/reports/?start=${convertDateToTimestamp(selectedStartDate)}&end=${convertDateToTimestamp(selectedEndDate)}`)

    useEffect(() => {
        if(user && user.auth_level >= 4 && user.branch_id){
            setSelectedBranch(user.branch_id);
        }
    }, [user]);

    const handleSelectStartDate = (selectedDate) => {
        setSelectedStartDate(selectedDate);
    }

    const handleSelectEndDate = (selectedDate) => {
        setSelectedEndDate(selectedDate);
    }

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await apiClient.get('/branch/?skip=0&limit=50');
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setBranches([]);
            }
        };
        
        fetchBranches();
        
    }, [user]);

    const handleBranchSelect = (selectedId) => {
        setSelectedBranch(selectedId);    
    };

    useEffect(() => {
        const newQueryParams = new URLSearchParams({
            start: convertDateToTimestamp(selectedStartDate),
            end: convertDateToTimestamp(selectedEndDate),
            ...(selectedBranch && { b: selectedBranch }),
        });
        setFetchUrl(`/payments/reports?${newQueryParams.toString()}`);

    }, [selectedStartDate, selectedEndDate, selectedBranch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient(fetchUrl);
                setData(response.data)
            } catch (error) {
                console.error(error)
                setData([])
            }
        }
        fetchData();
    }, [user, fetchUrl]);

    console.log(data)

    return (
        <Box>
            <VStack>
                <Stack flexDir={['column', 'row', 'row', 'row']}>
                    {selectedStartDate ? (
                        <DatePicker selectedDate={selectedStartDate} onSelect={handleSelectStartDate}/>
                    ):(
                        <Loading/>
                    )}
                    {selectedEndDate ? (
                        <DatePicker selectedDate={selectedEndDate} onSelect={handleSelectEndDate}/>
                    ):(
                        <Loading/>
                    )}
                    {branches ? (
                        <ChakraDropdown
                            options={branches}
                            label="ŞUBE"
                            value={selectedBranch}
                            initialValue={""}
                            onSelect={handleBranchSelect}
                        />
                    ):(
                        <Loading/>
                    )}
                </Stack>
                
            </VStack>
        </Box>

        
    )
}

export default EventStatements