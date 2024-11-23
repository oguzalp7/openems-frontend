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
    HStack,
  } from '@chakra-ui/react'

import InsertModal from '@/components/insert-modal.component'
import Calendar from '@/components/calendar.component'
import { convertDateToTimestamp, renameColumn, reorderColumns, validateAndCombineContact, normalizeData, removeKeysFromArrayOfObjects, reformatDates } from '@/utils'
import ChakraDataTable from '@/components/data-table.component'
import PaymentForm from '@/components/forms/payment-form.component'
import BridesMaidForm from '@/components/forms/bridesmaid-form.component'
import UpdateModal from '@/components/update-modal.component'
import EventUpdateForm from '@/components/forms/event-update-form.component'


const MSPage = () => {

    const {user} = useContext(AuthContext);

    // dropdown configuration
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("1");
    // dropdown configuration
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");

    const currentDate = new Date().toISOString().split('T')[0];

    const currentMonth = currentDate.split('-')[1]
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    // Get the current year
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [fetchURL, setFectURL] = useState("");
    const [monthlyEvents, setMonthlyEvents] = useState([]);

    // modal related hooks
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // modal data fetching purposes
    const [recordId, setRecordId] = useState('');
    const [row, setRow] = useState({})
    
    const toast = useToast();
    
    // Calculate years from (currentYear - 5) to (currentYear + 5)
    const generateYearOptions = () => {
        const yearRange = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        yearRange.push({ id: i, name: i.toString() });
        }
        return yearRange;
    };

    const handleSelectYear = (selectedYear) => {
        setSelectedYear(selectedYear)
    };

    useEffect(() => {
        if(user && user.branch_id){
          setSelectedBranch(user.branch_id);
        }
        
    }, [user]);
    
    useEffect(() => {
        if(user && user.department){
          if(user.department < 4){
            setSelectedDepartment(user.department)
          }
    }
    
    }, [user]);
    

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
                // toast({
                // title: 'Departmanlar getirilemedi.',
                // description: error.response.data.detail,
                // status: 'error',
                // //duration: 9000,
                // isClosable: true,
                // })
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
                // toast({
                // title: 'Şubeler getirilemedi.',
                // description: error.response.data.detail,
                // status: 'error',
                // //duration: 9000,
                // isClosable: true,
                // })
                setBranches([])
            }
        };

        fetchBranches();
    }, []);

    const handleBranchSelect = (selectedId) => {
        setSelectedBranch(selectedId);
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=${selectedDepartment}&active=true&skip=0&limit=100`);
                setEmployees(response.data)
            } catch (error) {
                setEmployees([])
                // toast({
                // title: 'Personel getirilemedi.',
                // description: error.response.data.detail,
                // status: 'error',
                // //duration: 9000,
                // isClosable: true,
                // })
            }
        }
        fetchEmployees();
    }, [selectedBranch, selectedDepartment]);
    
    const handleEmployeeSelect = (selectedId) => {
        setSelectedEmployee(selectedId);
    };
    
    useEffect(() => {
        const configureFetchOptions = async () => {
            let url = `/analysis/daily-events/${selectedEmployee}?month=${parseInt(selectedMonth).toString()}&year=${selectedYear}`
            setFectURL(url);
        }
        configureFetchOptions();
    }, [selectedBranch, selectedDepartment, selectedEmployee, selectedYear, selectedMonth]);

    // Convert first and last days of the selected month and year into unix timestamp
    // console.log(`${selectedYear}-${selectedMonth}-01`)
    // console.log(convertDateToTimestamp(`${selectedYear}-${selectedMonth}-01`))
    // console.log(`${selectedYear}-${selectedMonth}-${new Date(selectedYear, selectedMonth, 0).getDate()}`)
    // console.log(convertDateToTimestamp(`${selectedYear}-${selectedMonth}-${new Date(selectedYear, selectedMonth, 0).getDate()}`))
    
    useEffect(() => {
        const fetchMonthlyData = async () => {
            let startDate = convertDateToTimestamp(`${selectedYear}-${selectedMonth}-01`)
            let endDate = convertDateToTimestamp(`${selectedYear}-${selectedMonth}-${new Date(selectedYear, selectedMonth, 0).getDate()}`)
            //let url = `/event/by-month/?start=${startDate}&end=${endDate}&dep=${selectedDepartment}&b=${selectedBranch}&eid=${selectedEmployee}&skip=0&limit=500`
            let url = `/event/by-month/?start=${startDate}&end=${endDate}&dep=${selectedDepartment}&eid=${selectedEmployee}&skip=0&limit=500`
            try {
                const response = await apiClient.get(url)
                // apply data processing
                let processedData = response.data;

                

                if(selectedDepartment === "1" || selectedDepartment === 1){
                    // re-format the phone number and country code.
                    processedData = validateAndCombineContact(processedData, 'TELEFON', 'ÜLKE KODU');
                    
                    // re-name necessary columns
                    processedData = renameColumn(processedData, 'PERSONEL', 'MAKEUP1');
                    processedData = renameColumn(processedData, 'ARTI+', 'GELİN+');
                    processedData = reformatDates(processedData, 'TARİH', 'dd-mm-YYYY');
                    
                    // define order of the cols
                    const order = [ 'TARİH', 'SAAT', 'AD-SOYAD', 'telefon', 'İŞLEM', 'ŞEHİR', 'OTEL', 'ŞUBE', 'MAKEUP1', 'MAKEUP2', 'SAÇ', 'GELİN+', 'TST', 'ÜLKE', 'KAPORA', 'ÖDEME TİPİ', 'BAKİYE', 'id'];
                    //const order = ['TARİH', 'SAAT', 'AD-SOYAD', 'telefon', 'İŞLEM', 'ŞEHİR', 'OTEL', 'GELİN+','ŞUBE', 'id'];
                    processedData = reorderColumns(processedData, order);
                    
                    const keysToRemove = ['ÜLKE', 'MAKEUP1', 'MAKEUP2', 'SAÇ', 'KAPORA', 'ÖDEME TİPİ', 'BAKİYE'];
                    processedData = removeKeysFromArrayOfObjects(processedData, keysToRemove);
          
                  }else if(selectedDepartment === "2" || selectedDepartment === 2){
                    // re-format the phone number and country code.
                    processedData = validateAndCombineContact(processedData, 'TELEFON', 'ÜLKE KODU');
          
                    // define order of the cols
                    const order = [
                       'SIRA', 'SAAT', 'AD-SOYAD', 'telefon',  'İŞLEM', 'PERSONEL', "TST",
                       'BAKİYE'
                    ];
          
                    // re-order columns
                    processedData = reorderColumns(processedData, order);
          
                  }
                  else if(selectedDepartment === "3" || selectedDepartment === 3){
                    // re-format the phone number and country code.
                    processedData = validateAndCombineContact(processedData, 'TELEFON', 'ÜLKE KODU');
                    
                    // re-name necessary columns
                    // processedData = renameColumn(processedData, 'PERSONEL', 'NAILART');
                    processedData = renameColumn(processedData, 'num_nail_arts', 'NAILART');
                    
                    // define order of the cols
                    const order = [
                       'SIRA', 'SAAT', 'AD-SOYAD', 'telefon',  'İŞLEM', 'NAILART', 'PERSONEL',
                       'BAKİYE'
                    ];
          
                    // re-order columns
                    processedData = reorderColumns(processedData, order);
                  }else{
                    const order = ['SIRA', 'SAAT', 'PERSONEL', 'İŞLEM'];
                    processedData = reorderColumns(processedData, order);
                  }
                  processedData = normalizeData(processedData);
                setMonthlyEvents(processedData)
            } catch (error) {
                setMonthlyEvents([])
            }
        }
        fetchMonthlyData();
    }, [selectedBranch, selectedDepartment, selectedEmployee, selectedYear, selectedMonth]);
    //1725148800
    //1725148800
     // define button callbacks
    const handleUpdate = (rowData) => {
        //console.log(rowData);
        
        //console.log(originalRowData);
        setRecordId(rowData.id)
        setRow(rowData);
        // setModalContent(rowData);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchRecordById = async () => {
          try{
            if(recordId){
              const response = await apiClient.get(`/event/${recordId}`);
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
    }, [recordId]);

    const handleDelete = async (rowData) => {
        console.log('delete will not be implemented.');
        // try {
        //   const originalRowData = originalData.find((data) => data.SIRA === rowData.SIRA);
        //   const response = await apiClient.delete(`/event/${originalRowData.id}`)
        //   toast({
        //     title: 'Randevu Silindi.',
        //     description: "Sayfayı yenileyiniz.",
        //     status: 'error',
        //     //duration: 9000,
        //     isClosable: true,
        //   })
        // } catch (error) {
        //   console.error(error)
        // }
        
        
      }
      
      // define buttons
      const customButtons = [
        {
            label: 'Güncelle',
            color: 'gray',
            onClick: handleUpdate,
            isDisabled: false
        },
        {
            label: 'Sil',
            color: 'red',
            onClick: handleDelete,
            isDisabled: true
        },
      ];
    
      const contentButtons = [
        {
          label: 'ÖDEME',
          colorScheme: 'green',
          newContent: <PaymentForm remainingPayment={row['BAKİYE']} recordId={recordId}/>,
          disabled: (row['BAKİYE'] ? false : true) || row['İŞLEM'] === 'GELİN+'
        },
        {
          label: 'GELİN+',
          colorScheme: 'purple',
          newContent: <BridesMaidForm recordId={recordId} initialBranch={selectedBranch} selectedDate={row['TARİH']}/>,
          disabled: selectedDepartment === '' || !(selectedDepartment === '1') || row['İŞLEM'] === 'GELİN+' || !(row['GELİN+'] > 0)
        },
      ];

      const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
        setRow({})
        setRecordId('')
      };
    
    const handleSubmit = async (formData) => {
        
        toast({
            title: 'Randevuyu Buradan Güncelleyemezsiniz.',
            description: `Güncelleme için randevu takip sayfasını kullanınız.`,
            duration: 9000,
            isClosable: true,
        })

        // try {
        //     const response = await apiClient.put(`/event/${recordId}`, formData);
        //     if(response && (response.status === 200 || response.status === 201)){
        //     handleCloseModal();
        //     toast({
        //         title: 'Randevu Başarıyla Güncellendi.',
        //         //description: `Kalan bakiye: ${response.data.details.remaining_payment}`,
        //         status: 'success',
        //         //duration: 9000,
        //         isClosable: true,
        //     })
        // }
        // } catch (error) {
        //     toast({
        //     title: 'Randevu Güncellenemedi.',
        //     description: error.response.data.detail,
        //     status: 'error',
        //     //duration: 9000,
        //     isClosable: true,
        //     })
        // }
    }

    const actionButtons = [
        {
            label: "VAZGEÇ",
            colorScheme: "red",
            onClick: handleCloseModal,
        },
    ];
    
    
    return(
        <ProtectedRoute>
            
            <VStack>
                {/* <Stack>
                        <InsertModal buttonTitle='MUBERYA'>
                            <div>INSERT MUBO HERE</div>
                        </InsertModal>
                </Stack> */}
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
                            <ChakraDropdown options={generateYearOptions()} label={'YIL'} value={selectedYear} onSelect={handleSelectYear}/>
                            <ChakraDropdown options={months} label={'AY'} value={selectedMonth} initialValue={""} onSelect={handleSelectMonth}/>

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
                            
                            {employees ? ( // dynamic data loading
                                <ChakraDropdown
                                options={employees}
                                label="TÜMÜ"
                                initialValue={""}
                                value={selectedEmployee}
                                onSelect={handleEmployeeSelect}
                                />
                            ):(
                                <Loading/>
                            )}
                            
                            
                            
                        
                            
                            {/* <IconButton colorScheme='blue' onClick={resetFilters} icon={<GrPowerReset />} /> */}
                            </Stack>
                        </Box>
                    </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Text as={"b"}>AYLIK TAKVİM</Text>
                <Box>
                    <Calendar fetchURL={fetchURL}/>
                </Box>
                
                
                       

                {monthlyEvents ? (
                    <ChakraDataTable obj={monthlyEvents} customButtons={customButtons}/>
                ):(<Loading/>)}
                {isModalOpen && modalContent && recordId && (
                    <UpdateModal
                    isClosed={!isModalOpen}
                    contentButtons={contentButtons}
                    actionButtons={actionButtons}
                    onClose={handleCloseModal}
                    >
                        <EventUpdateForm onSubmit={handleSubmit} defaultValues={modalContent} eventId={recordId} />
                    </UpdateModal>
                )}
                
            </VStack>
        </ProtectedRoute>
        
    );
}

export default MSPage;

{/* <ChakraDropdown options={months} value={selectedMonth} initialValue={currentMonth} label={"AY"} onSelect={handleSelectMonth}/> */}