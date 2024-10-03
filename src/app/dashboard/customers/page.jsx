"use client"

import React, { useEffect, useState, useContext } from 'react'
import AuthContext from '@/context/AuthContext'
import { Button, Checkbox, Input, InputGroup, InputLeftAddon, useToast, Select, Stack, VStack, Box, SimpleGrid, Text, ModalContent, HStack } from '@chakra-ui/react';
import { validateAndCombineContact } from '@/utils';
import Loading from '@/components/loading.component';
import ChakraDataTable from '@/components/data-table.component';
import ProtectedRoute from '@/components/protected-route.component';
import { apiClient } from '@/apiClient';
import UpdateModal from '@/components/update-modal.component';
import CardComponent from '@/components/card.component';

const Customers = () => {

    const {user} = useContext(AuthContext);
    const toast = useToast();
    const [countryCodes, setCountryCodes] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('')

    const [phoneNumber, setPhoneNumber] = useState('');

    const [name, setName] = useState(''); 
    
    const [blacklisted, setBlacklisted] = useState(false);

    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);
    const [url, setURL] = useState('/customer/');

    const [recordId, setRecordId] = useState('');
    const [row, setRow] = useState({})
    // modal related hooks
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);

    const [pastEvents, setPastEvents] = useState([]);
    const [modalLoading, setModalLoading] = useState(true);
    

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
        
        // const originalRowData = originalData.find((data) => data.SIRA === rowData.SIRA);
        // if (originalRowData) {
        //     setRecordId(originalRowData.id);
        // } else {
        //     console.error('No matching data found in originalData for SIRA:', rowData.SIRA);
        // }
        //console.log(originalRowData);
        setRecordId(rowData.ID)
        //setModalContent(rowData);
        //setIsModalOpen(true);
        setRow(rowData)
    };
    
    useEffect(() => {
        const fetchRecordById = async () => {
            setModalLoading(true);
            try{
                if(recordId){
                    const response = await apiClient.get(`/customer/history/${recordId}`);
                    setModalContent(response.data);
                    //console.log(response.data)
                }
                
                
            }catch(error){
                console.error('Error fetching record:', error);
                setModalContent([])
                setRecordId('')
            }finally{
                setModalLoading(false);
            }
            
            //setModalContent(pastEventsData)
        }
        toast.closeAll();
        fetchRecordById();
    }, [isModalOpen, recordId]);
    
    
    
    useEffect(() => {
        modalContent.map((event, index) => {
            
            // toast({
            //         title: `${row['ADI']}`,
            //         description: `
            //                     TARİH: ${event['TARİH']}\n
            //                     ŞUBE: ${event['ŞUBE']}\n
            //                     İŞLEM: ${event['İŞLEM']}\n
            //                     PERSONEL: ${event['PERSONEL']}\n
            //         `,
            //         duration: 9000,
            //         isClosable: true,
            // })
            toast({
                position: 'bottom-right',
                isClosable: true,
                render: () => (
                  <Box 
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    p={4}
                    _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
                    transition="0.2s"
                    w={'full'}
                    bg={'blue.300'}
                    color={'black'}
                  >
                    <VStack spacing={2} align="start">
                        <Text fontWeight="bold" fontSize="lg">{row['ADI'].toUpperCase()}</Text>
                        <HStack>
                            <Text fontWeight="bold" fontSize="md" >TARİH:</Text>
                            <Text> {event['TARİH']}</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="bold" fontSize="md" >İŞLEM:</Text>
                            <Text> {event['İŞLEM']}</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="bold" fontSize="md" >ŞUBE:</Text>
                            <Text> {event['ŞUBE']}</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="bold" fontSize="md" >PERSONEL:</Text>
                            <Text> {event['PERSONEL']}</Text>
                        </HStack>
                    </VStack>
                  </Box>
                ),
            })
            
        })
    }, [modalContent, row]);

    

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
        setModalContent([]);
        setRecordId('');
        setRow({});
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
                    <ChakraDataTable  obj={data} title={'MÜŞTERİLER'} showButtons={false} customButtons={customButtons} />
                ):(
                    <Loading/>
                )}
                {isModalOpen && pastEvents && recordId && (
                    <UpdateModal
                        isClosed={!isModalOpen}
                        //contentButtons={contentButtons}
                        actionButtons={actionButtons}
                        onClose={handleCloseModal}
                    >   
                        
                        
                    {/* {modalContent ? (
                        //  <ChakraDataTable  obj={pastEvents} title={'RANDEVU GEÇMİŞİ'} showButtons={false} customButtons={[]}/>
                        // <Text>RANDEVU GEÇMİŞİ</Text>
                        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                            {modalContent.map((event, index) => (
                            <div key={index}>event</div>
                            ))}
                            
                        </SimpleGrid>
                    ) : (
                        <Loading/>
                    )} */}

                    {/* {modalContent.map((event, index) => {
                        <div>{JSON.stringify(event, null, 2)}</div>
                    })} */}

                    <div>{modalContent.length}</div>

                    </UpdateModal>
                )}
                </VStack>
        </ProtectedRoute>
    )
}

export default Customers;

