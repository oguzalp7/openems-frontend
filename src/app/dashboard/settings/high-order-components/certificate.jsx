"use client"

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '@/context/AuthContext'
import { apiClient } from '@/apiClient'
import Loading from '@/components/loading.component'

import { Box, VStack, Stack, Text, FormLabel, Input, HStack, Flex, Image, IconButton } from '@chakra-ui/react'

import DatePicker from '@/components/date-picker.component'
import ChakraDropdown from '@/components/dropdown.component'

import '@/styles/fonts.css';

import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
} from '@chakra-ui/react'

import { GrNext, GrPrevious  } from "react-icons/gr";


const CertificatePage = () => {
    const {user} = useContext(AuthContext);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(12);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(1);

    const [fixedEmployee, setFixedEmployee] = useState({});
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(66);

    const [gender, setGender] = useState('Mrs.');
    const genders = [{id: 'Mr.', name: 'Mr.'}, {id: 'Mrs.', name: 'Mrs.'}];
    const [name, setName] = useState('');

    const departmentMapping = ['Make-up Art', 'Hair Styling', 'Nail Art'];
    const monthMapping = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const [trainer, setTrainer] = useState('');
    const [left, setLeft] = useState(40)

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await apiClient.get('/branch/?skip=0&limit=20');
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setBranches([]);
            }
        };
        fetchBranches();
    }, [user]);

    useEffect(() => {
        const fetchDepartmentsByBranch = async () => {
            try {
                const response = await apiClient.get(`/branch/offline/${selectedBranch}`);
                setDepartments(response.data.departments)
            } catch (error) {
                setDepartments([{id: -1, name: 'fetch error'}])
            }
        }
        fetchDepartmentsByBranch();
    }, [user, selectedBranch]);

    useEffect(() => {
        const fetchEmployeesByBranchAndDepartment = async () => {
            try {
                const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=${selectedDepartment}&active=true&skip=0&limit=100`);
                setEmployees(response.data)
            } catch (error) {
                setEmployees([{id: -1, name: 'fetch error'}])
            }
        }
        fetchEmployeesByBranchAndDepartment();
    }, [user, selectedBranch, selectedDepartment]);

    const handleSelectDate = (selectedDate) => {
        setSelectedDate(selectedDate);
    }

    const handleSelectBranch = (selectedBranch) => {
        setSelectedBranch(selectedBranch);
    }

    const handleSelectDepartment = (department) => {
        setSelectedDepartment(department);
    }

    const handleSelectGender = (selectedGender) => {
        setGender(selectedGender);
    }

    const handleSelectEmployee = (selectedEmployee) => {
        setSelectedEmployee(selectedEmployee)
    }

    const handleDecreaseLeft = () => {
        setLeft(left - 1);
    }

    const handleIncreaseLeft = () => {
        setLeft(left + 1);
    }

    
    return (
        <>
        <Box>
            <VStack>
                <Stack flexDir={['column', 'column', 'column', 'column']}>
                    {user && branches ? (
                        <ChakraDropdown
                        options={branches}
                        label="ŞUBE"
                        initialValue={""}
                        value={selectedBranch}
                        onSelect={handleSelectBranch}
                        />
                    ) : (
                        <Loading />
                    )}
                    {user && departments && selectedBranch ? (
                        <ChakraDropdown
                        options={departments}
                        label={'DEPARTMAN'}
                        value={selectedDepartment}
                        initialValue={""}
                        onSelect={handleSelectDepartment}
                    />

                    ): (<Loading/>)}

                    {user && selectedDepartment && selectedBranch && employees ? (
                        <ChakraDropdown
                        options={employees}
                        label={'EĞİTMEN'}
                        value={selectedEmployee}
                        initialValue={""}
                        onSelect={handleSelectEmployee}
                    />

                    ): (<Loading/>)}

                    <Input type='text' value={trainer} onChange={(e) => {setTrainer(e.target.value)}} placeholder='EĞİTMEN ADI SOYADI' /> 

                    <DatePicker selectedDate={selectedDate} onSelect={handleSelectDate}/>
                    
                    <ChakraDropdown options={genders} label={'CİNSİYET'} initialValue={''} value={gender} onSelect={handleSelectGender} />
                    <Input type='text' value={name} onChange={(e) => {setName(e.target.value)}} placeholder='ADI SOYADI' />

                    <Slider
                        defaultValue={left}
                        value={left}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(val) => setLeft(val)}
                        >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <HStack justifyContent={'center'}>
                        <IconButton onClick={handleDecreaseLeft}  aria-label={'Sola kaydır'}>
                            < GrPrevious />
                        </IconButton>
                        <IconButton onClick={handleIncreaseLeft}  aria-label={'Sağa kaydır'}>
                            < GrNext />
                        </IconButton>
                    </HStack>
                                       
                </Stack>
                {/* Displaying the certificate with filled details */}
                <Box position="relative" width="900px" height="600px" marginLeft={'20px'} margin="auto" mt={10} textAlign={'center'}>
                        <Image src={'../cert-images/ms-cert-template.png'} alt="Certificate Template" boxSize="100%" objectFit="cover" />
                        
                        {/* Overlay text for each field, styled and positioned on the certificate */}
                        <Text fontFamily={'Corinthia'} position="absolute" top="47%" left={`${left}%`}   fontSize="60px" fontWeight="medium" color="black">
                            {`${gender}${name}`}
                        </Text>

                        <Text noOfLines={2} fontFamily={'Gideon'}  position="absolute" top="60%" left='10%' right="10%" fontSize="20px" fontWeight="bold" color="gray">
                            {`Has successfully completed the ${departmentMapping[selectedDepartment - 1]} training given by ${trainer} on ${monthMapping[new Date(selectedDate).getMonth() - 1]} ${new Date(selectedDate).getDate()} - ${new Date(selectedDate).getDate() + 1}, ${new Date(selectedDate).getFullYear()} and was entitled to receive this certificate. `}
                        </Text>

                        <Text  position="absolute" top="90%" left='5%' color={'gray.300'}>
                             {'8805aab9dbc5cad1d7fcbd3f6d21d3f0'}
                        </Text>
                         
                        
                </Box>
            </VStack>
        </Box>
        

    
        </>
       
    )
}

export default CertificatePage