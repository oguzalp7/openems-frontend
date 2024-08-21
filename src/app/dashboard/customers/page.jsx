"use client"

import React, { useEffect, useState, useContext } from 'react'
import AuthContext from '@/context/AuthContext'
import { Button, Checkbox, Input, InputGroup, InputLeftAddon, Select, Stack, VStack } from '@chakra-ui/react';
import { validateAndCombineContact } from '@/utils';
import Loading from '@/components/loading.component';
import ChakraDataTable from '@/components/data-table.component';
import ProtectedRoute from '@/components/protected-route.component';
import { apiClient } from '@/apiClient';
import UpdateModal from '@/components/update-modal.component';

const Customers = () => {

    const {user} = useContext(AuthContext);

    const [countryCodes, setCountryCodes] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('')

    const [phoneNumber, setPhoneNumber] = useState('');

    const [name, setName] = useState(''); 
    
    const [blacklisted, setBlacklisted] = useState(false);

    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);
    const [url, setURL] = useState('/customer/');

    const [recordId, setRecordId] = useState('');

    // modal related hooks
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // configure fetch options
    useEffect(() => {

        let newUrl = '/customer/';
        const params = [];
        
        if (selectedCountryCode) {
        params.push(`cc=${selectedCountryCode}`);
        }

        if (phoneNumber) {
        params.push(`p=${phoneNumber}`);
        }

        if (name) {
        params.push(`n=${name}`);
        }

        if (blacklisted) {
        params.push(`bl=${blacklisted}`);
        }

        if (params.length > 0) {
        newUrl += `?${params.join('&')}`;
        }
        setURL(newUrl);

    }, [selectedCountryCode, phoneNumber, name, blacklisted]);

    const handleCountryCodeSelect = (selectedValue) => {
    
        setSelectedCountryCode(selectedValue);
        
    };

    const handleSelectPhoneNumber = (selectedPhoneNumber) => {
        setPhoneNumber(selectedPhoneNumber.target.value);
    }

    const handleSelectName = (selectedName) => {
        setName(selectedName.target.value);
    }

    const handleSelectBlacklisted = (selectedBlacklisted) => {
        setBlacklisted(selectedBlacklisted.target.checked);
    }

    useEffect(() => {
        const fetchCustomers = async () => {
    
        try {
            const response = await apiClient.get(url);
            let processedData = response.data;
            processedData = validateAndCombineContact(processedData, 'TELEFON NUMARASI', 'ÜLKE KODU');
            setData(processedData);
            setOriginalData(processedData);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
        };

        fetchCustomers();
    }, [user, url]);

    useEffect(() => {
        const fetchCountryCodes = async () => {

        try {
            const response = await apiClient.get('/customer/countryCodes/');
            setCountryCodes(response.data);
            
        } catch (error) {
            console.error('Error fetching country codes:', error);
        }
        };

        fetchCountryCodes();
    }, [user]);

    

    const resetFilters = () => {
        setSelectedCountryCode("")
        setName("")
        setPhoneNumber("")
        setBlacklisted(false)
    }


    const handleUpdate = (rowData) => {
        console.log(rowData);
        // const originalRowData = originalData.find((data) => data.SIRA === rowData.SIRA);
        // if (originalRowData) {
        //     setRecordId(originalRowData.id);
        // } else {
        //     console.error('No matching data found in originalData for SIRA:', rowData.SIRA);
        // }
        //console.log(originalRowData);
        setRecordId(rowData.ID)
        // setModalContent(rowData);
        setIsModalOpen(true);
    };
    
    useEffect(() => {
        const fetchRecordById = async () => {
        
            try{
                if(recordId){
                    const response = await apiClient.get(`/customer/${recordId}`);
                    setModalContent(response.data)
                    //setRecordId('')
                }
            }catch(error){
                console.error('Error fetching record:', error);
                setModalContent(null)
                setRecordId('')
            }
        }
        fetchRecordById();
    }, [user, recordId]);

    const handleDelete = async (rowData) => {
        /* const originalRowData = originalData.find((data) => data.SIRA === rowData.SIRA);
        if (!originalRowData) {
        console.error('No matching data found in originalData for SIRA:', rowData.SIRA);
        return;
        }
        console.log(originalRowData)
        const customerId = originalRowData.id;
        const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sess.token}`,
        },
        };
    
        try {
        await apiClient.delete(`/customer/${customerId}`, requestOptions);
        setData((prevData) => prevData.filter((customer) => customer.id !== customerId));
        setOriginalData((prevData) => prevData.filter((customer) => customer.id !== customerId));
        } catch (error) {
        console.error('Error deleting customer:', error.response ? error.response.data : error.message);
        } */
    };

    // define buttons
    const customButtons = [
        {
            label: 'Güncelle',
            color: 'gray',
            onClick: handleUpdate,
        },
        {
            label: 'Sil',
            color: 'red',
            onClick: handleDelete,
        },
            
    ];

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
        setRecordId('')
    };

    const actionButtons = [
    
        {
          label: "VAZGEÇ",
          colorScheme: "red",
          onClick: handleCloseModal,
        },
      ];

    return (
        <ProtectedRoute>
            <VStack>
                <Stack flexDir={['column', 'column', 'row', 'row']}>
                    <InputGroup>
                        <InputLeftAddon>
                            {countryCodes ? (
                            <Select borderColor={"transparent"}
                            placeholder=" " 
                            value={selectedCountryCode} 
                            onChange={(e) => handleCountryCodeSelect(e.target.value)}
                            >
                            {countryCodes.map((code) => (
                            <option key={code} value={code}>
                            {code}
                            </option>
                            ))}
                            </Select>
                            ):( 
                            <Loading/>
                            )}
                        </InputLeftAddon>
                        <Input 
                            value={phoneNumber}
                            type='tel'
                            onChange={handleSelectPhoneNumber} 
                            placeholder='Telefon Numarası' />
                        
                    </InputGroup>
                    <Input
                        value={name}
                        onChange={handleSelectName}
                        placeholder='Müşteri Adı'
                        />
                
                    <Checkbox isChecked={blacklisted} onChange={handleSelectBlacklisted}>Kara Liste</Checkbox>
                    
                    
                    <Button background={'transparent'} onClick={resetFilters}>RESET</Button>
                </Stack>
                {data ? (
                    <ChakraDataTable  obj={data} title={'MÜŞTERİLER'} showButtons={true} customButtons={customButtons} />
                ):(
                    <Loading/>
                )}
                {/* {isModalOpen && modalContent && recordId && (
                    <UpdateModal
                        isClosed={!isModalOpen}
                        //contentButtons={contentButtons}
                        actionButtons={actionButtons}
                        onClose={handleCloseModal}
                    >
                    {JSON.stringify(modalContent, null, 2)}
                    
                    </UpdateModal>
                )} */}
                </VStack>
        </ProtectedRoute>
    )
}

export default Customers;