"use client";

import React, { useEffect, useState, useContext } from 'react'

import { Box, useToast, Tag, TagLabel, TagCloseButton, Divider, Text, HStack, VStack, Input, Button, Spinner } from '@chakra-ui/react';
import ChakraDropdown from '../dropdown.component';
import AuthContext from '@/context/AuthContext';
import { apiClient } from '@/apiClient';
import DatePicker from '../date-picker.component';

const IndividualDiscountForm = ({data, onSubmit, onCancel }) => {
    const [percentage, setPercentage] = useState(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [processes, setProcesses] = useState([]);
    const [buffer, setBuffer] = useState([]);
    const toast = useToast();
    const { user } = useContext(AuthContext);
    const employeeId = data.id;
    const employee = data.name;
    //const processes = data.data;

    
    const [depId, setDepId] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await apiClient.get(`/employees/${employeeId}`);
                setDepId(response.data.department_id);
            } catch (error) {
                console.error('Error fetching employee:', error);
                setDepId('');
            }
        }
        fetchEmployee();
    }, [user]);

    // console.log(data);

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await apiClient.get(`/processes/light/${depId}`); // Adjust the endpoint
                setProcesses(response.data);
            } catch (error) {
                toast({
                    title: "Veriler getirilemedi.",
                    description: error.response?.data?.message || error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        if(depId){
            fetchProcesses();
        }
        
    }, [user, depId]);

    const handleAddToBuffer = (process) => {
        setBuffer([...buffer, process]);
        setProcesses(processes.filter(p => p.id !== process.id));
    };

    const handleRemoveFromBuffer = (process) => {
        setProcesses([...processes, process]);
        setBuffer(buffer.filter(p => p.id !== process.id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {start_date: startDate, end_date: endDate, percentage: percentage,  processes: "[" + buffer.map(p => p.id).toString() + "]", employee_id: employeeId};
        onSubmit(data);
    };

    //console.log(processes);
    
    return(
        <Box>
            <form onSubmit={handleSubmit}>
            <HStack w={'full'} mb={4}>
                <Text fontSize="lg">Başlangıç Tarihi:</Text>
                <DatePicker selectedDate={startDate} onSelect={setStartDate} />
            </HStack>
            <HStack w={'full'} mb={4}>
                <Text fontSize="lg">Bitiş Tarihi:</Text>
                <DatePicker selectedDate={endDate} onSelect={setEndDate} />
            </HStack>

            <HStack w={'full'} mb={4}>
                <Text fontSize="lg">%:</Text>
                <Input type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
            </HStack>
            <Divider mt={5}/>
            <VStack>
                
                <Box mb={4} mt={5}>
                    {processes.map(process => (
                        <Tag
                            key={process.id}
                            size="lg"
                            borderRadius="full"
                            variant="outline"
                            colorScheme="blue"
                            m={1}
                            onClick={() => handleAddToBuffer(process)}
                            cursor={"pointer"}
                        >
                            <TagLabel>{"+" + process.name}</TagLabel>
                        </Tag>
                    ))}
                </Box>
                <Divider />
                <Box mt={4}>
                    {buffer.map(process => (
                        <Tag
                            key={process.id}
                            size="lg"
                            borderRadius="full"
                            variant="outline"
                            colorScheme="red"
                            m={1}
                            onClick={() => handleRemoveFromBuffer(process)}
                            cursor={"pointer"}
                        >
                            <TagLabel>{process.name}</TagLabel>
                            <TagCloseButton />
                        </Tag>
                    ))}
                </Box>
                <Button w='full' type="submit" colorScheme="blue" mt={4}>
                KAYDET
            </Button>
            </VStack>
            
            </form>
        </Box>
    );
}

export default IndividualDiscountForm;