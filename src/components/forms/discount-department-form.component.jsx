"use client";

import React, { useEffect, useState, useContext } from 'react'

import { Box, useToast, Tag, TagLabel, TagCloseButton, Divider, Text, HStack, VStack, Input, Button, Spinner } from '@chakra-ui/react';
import ChakraDropdown from '../dropdown.component';
import AuthContext from '@/context/AuthContext';
import { apiClient } from '@/apiClient';
import DatePicker from '../date-picker.component';
import { set } from 'date-fns';

const DiscountDepartmentForm = ({ onSubmit, onCancel }) => {
    
    const [percentage, setPercentage] = useState(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    const [processes, setProcesses] = useState([]);
    const [buffer, setBuffer] = useState([]);
    const toast = useToast();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await apiClient.get('/departments/advanced/?skip=0&limit=3');
                setDepartments(response.data);
                //setBranches(response.data.branches);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setDepartments([]);
                //setBranches([]);
            }
        };

        fetchDepartments();
    }, [user]);

    useEffect(() => { 
        if (departments.length > 0) {
            setSelectedDepartment(departments[0].id);
        }
    }, [departments]);

    useEffect(() => {
        if (departments.length > 0 && selectedDepartment) {
            const selectedDep = departments.at(selectedDepartment - 1);
            if (selectedDep) {
                setBranches(selectedDep.branches);
            }
        }
    }, [ selectedDepartment]);

    
    //console.log(departments.at(selectedDepartment - 1).branches);
    

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await apiClient.get(`/processes/light/${selectedDepartment}`); // Adjust the endpoint
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
        if(selectedDepartment){
            fetchProcesses();
        }
    }, [user, selectedDepartment]);

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
        const data = {payload: {start_date: startDate, end_date: endDate, percentage: percentage,  processes: "[" + buffer.map(p => p.id).toString() + "]" }, dep: selectedDepartment, branch: selectedBranch};
        // const processIds = buffer.map(p => p.id);
        onSubmit(data);
    };
    
    
    return (
        <Box mt={10}>
            <HStack w={'full'} mb={4}>
                <Text fontSize="lg">*Departman:</Text>
                <ChakraDropdown label="Departman" options={departments} value={selectedDepartment} onSelect={setSelectedDepartment} />
            </HStack>
            {branches && branches.length > 0 ? (<HStack w={'full'} mb={4}>
                <Text fontSize="lg">Şube:</Text>
                <ChakraDropdown label="Şube (Opsiyonel)" options={branches} value={selectedBranch} onSelect={setSelectedBranch} />
            </HStack>) : <Spinner/>}
            <Divider mt={5}/>
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

export default DiscountDepartmentForm;