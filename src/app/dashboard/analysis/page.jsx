"use client"

import React, {useState, useEffect, useContext} from 'react'
import { apiClient } from '@/apiClient'
import DatePicker from '@/components/date-picker.component'
import ChakraDropdown from '@/components/dropdown.component'
import Loading from '@/components/loading.component'
import { Box, VStack, HStack, Stack } from '@chakra-ui/react'
import { convertDateToTimestamp } from '@/utils'
import BarChart from '@/components/chart-components/bar-chart.component'
import AnalysisTable from '@/components/analysis-table.component'

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

import ProtectedRoute from '@/components/protected-route.component'
import AuthContext from '@/context/AuthContext'

const Analysis = () => {
    const {user} = useContext(AuthContext);

    // Calculate the first day of the year
    const currentYear = new Date().toISOString().split('T')[0].split("-")[0]
    const firstDayOfYear = `${currentYear}-01-01`

    const [selectedStartDate, setSelectedStartDate] = useState(firstDayOfYear);
    const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [chartDataFetchURL, setChartDataFetchURL] = useState('');
    const [tableDataFetchURL, setTableDataFetchURL] = useState('');

    const [chartData, setChartData] = useState([])
    const [tableData, setTableData] = useState([])

    

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
        const fetchDepartmentsByBranch = async () => {
            try {
                const response = await apiClient.get(`/branch/offline/${selectedBranch}`);
                setDepartments(response.data.departments)
            } catch (error) {
                setDepartments([{id: -1, name: 'fetch error'}])
            }
        }
        
        if(selectedBranch){
            fetchDepartmentsByBranch();
        }
        
    }, [user, selectedBranch]);
    
    const handleDepartmentSelect = (selectedId) => {
        setSelectedDepartment(selectedId);
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            let url = `/employees/?active=true&skip=0&limit=100`
            if(selectedBranch){
                url += `&b=${selectedBranch}`
            }
            if(selectedDepartment){
                url += `&dep=${selectedDepartment}`
            }
            try {
                const response = await apiClient.get(url);
                setEmployees(response.data)
            } catch (error) {
                setEmployees([]);
            }
        }
        fetchEmployees();
    }, [user, selectedBranch, selectedDepartment]);

    const handleEmployeeSelect = (selectedId) => {
        setSelectedEmployee(selectedId);
    }

    useEffect(() => {
        if(!selectedBranch){
            setSelectedDepartment('')
            if(!selectedDepartment){
                setSelectedEmployee('')
            }
        }
    });

    useEffect(() => {
        const newQueryParams = new URLSearchParams({
            start: convertDateToTimestamp(selectedStartDate),
            end: convertDateToTimestamp(selectedEndDate),
            ...(selectedBranch && { b: selectedBranch }),
            ...(selectedDepartment && { dep: selectedDepartment }),
            ...(selectedEmployee && {eid: selectedEmployee}),
        });
        setChartDataFetchURL(`/analysis/chart?${newQueryParams.toString()}`);
        setTableDataFetchURL(`/analysis/table?${newQueryParams.toString()}`);
    }, [selectedStartDate, selectedEndDate, selectedBranch, selectedDepartment, selectedEmployee]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await apiClient.get(chartDataFetchURL);
                setChartData(response.data);
            } catch (error) {
                setChartData([]);
            }
        }
        fetchChartData();
    }, [user, chartDataFetchURL]);

    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const response = await apiClient.get(tableDataFetchURL);
                setTableData(response.data);
            } catch (error) {
                setTableData([]);
            }
        }
        fetchTableData();
    }, [user, tableDataFetchURL]);

    return (
        <ProtectedRoute>
            <Box>
                <VStack>
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

                                {selectedBranch && (
                                    <>
                                        {departments ? ( 
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
                                    </>
                                )} 
                                {selectedBranch  && selectedDepartment && (
                                    <>
                                        {employees  ? (
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
                                        </>
                                )}
                                
                            </Stack>
                        </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    
                    {chartData ? (
                        <BarChart chartTitle={''} chartData={chartData}/>
                    ): (
                        <Loading/>
                    )}

                    <HStack spacing={1} overflow={'auto'} w={'lg'} border={'1px'} borderColor={'gray.300'} borderRadius={10}>
                        {chartData ? (
                            <AnalysisTable data={chartData} title='TOPLAM'/>
                        ):(
                            <Loading/>
                        )}

                        {tableData ? (
                            <AnalysisTable data={tableData} title='İŞLEMLER'/>
                        ):(
                            <Loading/>
                        )}


                    </HStack>
                    

                </VStack>
            </Box>
        </ProtectedRoute>
    )
}

export default Analysis;