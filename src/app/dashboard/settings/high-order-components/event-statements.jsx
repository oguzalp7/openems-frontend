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

import { Table, Thead, Tbody, Tr, Th, Td, Button, Text, TableContainer } from '@chakra-ui/react';

import exportExcel from '@/exportExcel'

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

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [data, setData] = useState([]);
    const [overallTotal, setOverallTotal] = useState({});
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
        const fetchEmployees = async () => {
            let url = `/employees/?active=true&skip=0&limit=100`
            if(selectedBranch){
                url += `&b=${selectedBranch}`
            }
            try {
                const response = await apiClient.get(url);
                setEmployees(response.data)
            } catch (error) {
                setEmployees([]);
            }
        }
        fetchEmployees();
    }, [user, selectedBranch]);

    const handleEmployeeSelect = (selectedId) => {
        setSelectedEmployee(selectedId);    
    };

    useEffect(() => {
        const newQueryParams = new URLSearchParams({
            start: convertDateToTimestamp(selectedStartDate),
            end: convertDateToTimestamp(selectedEndDate),
            ...(selectedBranch && { b: selectedBranch }),
            ...(selectedEmployee && { eid: selectedEmployee }),
        });
        setFetchUrl(`/payments/reports/?${newQueryParams.toString()}`);

    }, [selectedStartDate, selectedEndDate, selectedBranch, selectedEmployee]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient(fetchUrl);
                //setData(response.data)
                const fetchedData = response.data;

            setOverallTotal(fetchedData["OVERALL_TOTAL"]);
            delete fetchedData["OVERALL_TOTAL"];
            
            setData(Object.entries(fetchedData)); // Convert the data object to an array of key-value pairs
            } catch (error) {
                console.error(error)
                setData([])
            }
        }
        fetchData();
    }, [user, fetchUrl]);

    // const categories = {};
    // let overallTotals = {};

    // data.forEach((entry) => {
    //     const date = Object.keys(entry)[0];
    //     const details = entry[date];

    //     if (date === "OVERALL_TOTAL") {
    //     overallTotals = details;
    //     return;
    //     }

    //     Object.keys(details).forEach((category) => {
    //     if (!categories[category] && category !== 'TOPLAM') {
    //         categories[category] = new Set();
    //     }
    //     if (category !== 'TOPLAM') {
    //         Object.keys(details[category]).forEach((paymentType) => {
    //         categories[category].add(paymentType);
    //         });
    //     }
    //     });
    // });

    // const sortedCategories = Object.keys(categories).sort();

    const sortedCategories = [
        ...new Set(
          data.flatMap(([date, processes]) =>
            Object.keys(processes).filter(
              (category) => category !== "TOPLAM" && category !== "OVERALL_TOTAL"
            )
          )
        ),
    ];
    
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
                    {employees ? (
                        <ChakraDropdown
                            options={employees}
                            label="PERSONEL"
                            value={selectedEmployee}
                            initialValue={""}
                            onSelect={handleEmployeeSelect}
                        />
                    ):(
                        <Loading/>
                    )}
                </Stack>

                <Box w={['sm', 'md', 'lg', '8xl']}>
                    <TableContainer 
                        w={['sm', 'lg', 'xl', 'full']}
                        //w={['sm']} //daraltma
                        maxWidth={'100%'}
                        h={['sm', 'md',  'auto']}
                        p={[0, 8, 0, 0]}
                        //marginLeft={[-90, -50, -100]}
                        maxHeight={"70vh"}
                        overflowX={'auto'}
                        overflowY={'auto'}
                        >
                        
                        <Table variant="simple" border="1px solid black" borderCollapse="collapse" colorScheme='blue' size={['md', 'lg']}  w={['full']}> 
                            <Thead>
                                <Tr  bgColor={'teal'} border="1px solid black">
                                <Th color={'black'} rowSpan="2" border="1px solid black">TARİH</Th>
                                {sortedCategories.map((category) => (
                                    <Th color={'black'} textAlign={'center'} verticalAlign="middle" key={category}  p={4} colSpan={2} border="1px solid black">{category}</Th>
                                ))}
                                <Th color={'black'} colSpan={2} border="1px solid black" textAlign="center" verticalAlign="middle">TOPLAM</Th>
                                <Th color={'black'} border="1px solid black" borderStyle={'solid'} rowSpan="2">GENEL TOPLAM</Th>
                                </Tr>
                                <Tr   border="1px solid black">
                                {/* {sortedCategories.flatMap((category) =>
                                    Array.from(categories[category]).map((paymentType) => (
                                    <Th p={2} border="1px solid black" key={`${category}-${paymentType}`}>{paymentType}</Th>
                                    ))
                                    
                                )} */}
                                {sortedCategories.flatMap((category) => [
                                <Th color={'black'} bgColor={'teal.100'} border="1px solid black" key={`${category}-nakit`} textAlign="center">
                                    NAKİT
                                </Th>,
                                <Th color={'black'} bgColor={'teal.300'} border="1px solid black" key={`${category}-visa`} textAlign="center">
                                    VISA
                                </Th>,
                                ])}
                                <Th color={'black'} bgColor={'teal.100'} border="1px solid black" textAlign="center" verticalAlign="middle">NAKİT</Th>
                                <Th color={'black'} bgColor={'teal.300'} border="1px solid black" textAlign="center" verticalAlign="middle">VISA</Th>
                                {/* <Th border="1px solid black" textAlign="center" verticalAlign="middle">NAKİT</Th>
                                <Th border="1px solid black" textAlign="center" verticalAlign="middle">VISA</Th>
                                */}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {/* {data.map((entry, index) => {
                                const date = Object.keys(entry)[0];
                                const details = entry[date];
                                const totals = { NAKİT: 0, VISA: 0 }; // Track totals for each payment type

                                return (
                                    <Tr border="1px solid black" key={index}>
                                    <Td border="1px solid black">{date}</Td>
                                    {sortedCategories.map((category) =>
                                        Array.from(categories[category]).map((paymentType) => {
                                        const amount = details?.[category]?.[paymentType] || 0;
                                        totals[paymentType] += amount;
                                        return <Td border="1px solid black" key={`${category}-${paymentType}`}>{amount}</Td>;
                                        })
                                    )}
                                    <Td border="1px solid black">{totals.NAKİT + totals.VISA}</Td>
                                    </Tr>
                                );
                                })} */}

                                {data.map(([date, processes]) => (
                                    <Tr color={'black'} bgColor={'gray.500'} key={date}>
                                    <Td border="1px solid black">{date}</Td>
                                    {sortedCategories.flatMap((category) => [
                                        <Td bgColor={'gray.100'} border="1px solid black" key={`${date}-${category}-nakit`} textAlign="center">
                                        {processes[category]?.NAKİT || 0}
                                        </Td>,
                                        <Td bgColor={'gray.300'} border="1px solid black" key={`${date}-${category}-visa`} textAlign="center">
                                        {processes[category]?.VISA || 0}
                                        </Td>,
                                    ])}
                                    <Td bgColor={'gray.100'} border="1px solid black" textAlign="center">{processes["TOPLAM"]?.NAKİT || 0}</Td>
                                    <Td bgColor={'gray.300'} border="1px solid black" textAlign="center">{processes["TOPLAM"]?.VISA || 0}</Td>
                                    {/* <Td textAlign="center">{processes["TOPLAM"]?.NAKİT || 0}</Td>
                                    <Td textAlign="center">{processes["TOPLAM"]?.VISA || 0}</Td> */}
                                    <Td bgColor={'cyan'} border="1px solid black" textAlign={'center'}>{processes["TOPLAM"]?.NAKİT + processes["TOPLAM"]?.VISA || 0}</Td>
                                    </Tr>
                                ))}
                                <Tr color={'black'} bgColor={'lightblue'} fontWeight="bold">
                                    <Td border="1px solid black">GENEL TOPLAM</Td>
                                    {sortedCategories.flatMap((category) => [
                                    <Td  key={`total-${category}-nakit`} textAlign="center">
                                        {overallTotal[category]?.NAKİT || " "}
                                    </Td>,
                                    <Td  key={`total-${category}-visa`} textAlign="center">
                                        {overallTotal[category]?.VISA || " "}
                                    </Td>,
                                    ])}
                                    <Td border="1px solid black" textAlign="center">{overallTotal["NAKİT"] || 0}</Td>
                                    <Td border="1px solid black" textAlign="center">{overallTotal["VISA"] || 0}</Td>
                                    <Td border="1px solid black" colSpan={2} textAlign="center">
                                    {overallTotal["GENEL_TOPLAM"] || 0}
                                    </Td>
                                </Tr>

                            </Tbody>
                        </Table>
                    </TableContainer>
                      
                </Box>
                <Button
                    onClick={() => exportExcel(data, overallTotal)}
                    colorScheme="blue"
                    mt={4}
                >
                    İNDİR
                </Button> 
            </VStack>
        </Box>
    )
}

export default EventStatements