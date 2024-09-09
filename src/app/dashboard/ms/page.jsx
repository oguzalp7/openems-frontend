"use client"

import React, {useState, useEffect, useContext} from 'react'
import { apiClient } from '@/apiClient'
import Loading from '@/components/loading.component'

import ProtectedRoute from '@/components/protected-route.component'
import AuthContext from '@/context/AuthContext'
import ChakraDropdown from '@/components/dropdown.component'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    useToast,
    Stack,
    VStack,
    IconButton,
    Text,
  } from '@chakra-ui/react'

const MSPage = () => {

    const {user} = useContext(AuthContext);

    // dropdown configuration
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    // dropdown configuration
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    const currentDate = new Date().toISOString().split('T')[0];

    const currentMonth = currentDate.split('-')[1]
    const currentYear = currentDate.split('-')[0]

    const [selectedMonth, setSelectedMonth] = useState(currentMonth)

    const months = [
        {id: "01", name: "OCAK"},
        {id: "02", name: "ŞUBAT"},
        {id: "03", name: "MART"},
        {id: "04", name: "NİSAN"},
        {id: "05", name: "MAYIS"},
        {id: "06", name: "HAZİRAN"},
        {id: "07", name: "TEMMUZ"},
        {id: "08", name: "AĞUSTOS"},
        {id: "09", name: "EYLÜL"},
        {id: "10", name: "EKİM"},
        {id: "11", name: "KASIM"},
        {id: "12", name: "ARALIK"},
    ]
    
    const handleSelectMonth = (selectedId) => {
        setSelectedMonth(selectedId)
    }

    // fetch dropdown data for department
    useEffect(() => {
        const fetchDepartments = async () => {
        try {
            const response = await apiClient.get('/departments/?skip=0&limit=3');
            setDepartments(response.data);
        } catch (error) {
            setDepartments([])
            toast({
            title: 'Departmanlar getirilemedi.',
            description: error.response.data.detail,
            status: 'error',
            //duration: 9000,
            isClosable: true,
        })
        }
        };
        fetchDepartments();
    }, []);

    const handleDepartmentSelect = (selectedId) => {
        setSelectedDepartment(selectedId);
    };

    // fetch dropdown data for branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await apiClient.get('/branch/?skip=0&limit=20');
                
                setBranches(response.data);
            } catch (error) {
                toast({
                title: 'Şubeler getirilemedi.',
                description: error.response.data.detail,
                status: 'error',
                //duration: 9000,
                isClosable: true,
                })
                setBranches([])
            }
        };

        fetchBranches();
    }, []);

    const handleBranchSelect = (selectedId) => {
        setSelectedBranch(selectedId);
    };

    console.log(selectedMonth)

    return(
        <ProtectedRoute>
            
            <Accordion defaultIndex={[0]} allowToggle>
                <AccordionItem>
                <h2>
                    <AccordionButton  _expanded={{ bg: 'lightblue', color: 'gray.900' }}>
                    <Box as='span' flex='1' textAlign='left'>
                        FİLTRELE
                    </Box>
                    <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <Box w={['sm', 'md', 'lg', '2xl']}>
                        <Stack flexDir={['column', 'row', 'row', 'row']} justify="center" align="center">

                        
                        
                        {departments ? ( // dynamic data loading
                            <ChakraDropdown
                            options={departments}
                            label="TÜMÜ"
                            initialValue={""}
                            value={selectedDepartment}
                            onSelect={handleDepartmentSelect}
                            />
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
                        <ChakraDropdown options={months} value={selectedMonth} initialValue={""} onSelect={handleSelectMonth}/>

                        
                        {/* <IconButton colorScheme='blue' onClick={resetFilters} icon={<GrPowerReset />} /> */}
                        </Stack>
                    </Box>
                </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </ProtectedRoute>
        
    );
}

export default MSPage;

{/* <ChakraDropdown options={months} value={selectedMonth} initialValue={currentMonth} label={"AY"} onSelect={handleSelectMonth}/> */}