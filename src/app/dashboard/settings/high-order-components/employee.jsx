"use client"
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '@/context/AuthContext'
import { apiClient } from '@/apiClient'
import { HStack, VStack, Box } from '@chakra-ui/react'
import useToggleSwitch from '@/hooks/useToggleSwitch'
import NeonToggleSwitch from '@/components/neon-switch.component'
import ChakraDropdown from '@/components/dropdown.component'
import BaseHOC from './base'
import UserEmployeeUpdateForm from '@/components/forms/user-employee-update-form.component'


const Employees = () => {

    const {user} = useContext(AuthContext);
    const limit = 50;
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
  
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
  
    const slug = '/user-employee'
    const [fetchUrl, setFetchURL] = useState(`${slug}/?skip=0&limit=${limit}`)
  
  
    const [isOn, toggleSwitch] = useToggleSwitch();

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
    
      const handleSelectBranch = (selectedId) => {
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
    const newQueryParams = new URLSearchParams({
        skip: '0',
        limit: limit.toString(),
        ...(selectedBranch && { b: selectedBranch }),
        ...(selectedDepartment && { dep: selectedDepartment }),
        active: isOn ? 'true' : 'false',
    });
    setFetchURL(`${slug}/?${newQueryParams.toString()}`);
    }, [selectedBranch, selectedDepartment, isOn, limit]);
    
  return (
    <Box>
      <VStack>
        <HStack>
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

            {user && selectedBranch && (
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
                        <Loading />
                    )
                }
                </>
            )}
            <Box>
              <NeonToggleSwitch isOn={isOn} toggleSwitch={toggleSwitch} />
            </Box>
        </HStack>
        {fetchUrl &&(
          <BaseHOC slug={slug} tableTitle={'ÇALIŞANLAR'} fetchUrl={fetchUrl} updateForm={<UserEmployeeUpdateForm/>}/>
        )}
      </VStack>
    </Box>
  )
}

export default Employees;