"use client"
import React, {useContext, useState, useEffect} from 'react'
import ProtectedRoute from '@/components/protected-route.component';
import AuthContext from '@/context/AuthContext';
import { apiClient } from '@/apiClient';
import DatePicker from '@/components/date-picker.component';
import ChakraDropdown from '@/components/dropdown.component';
import { convertDateToTimestamp, reorderColumns, validateAndCombineContact, renameColumn, formatTime, hideKeysInArrayOfObjects, removeKeysFromArrayOfObjects, normalizeData } from '@/utils';
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
import { GrPowerReset } from "react-icons/gr";
import ChakraDataTable from '@/components/data-table.component';
import Loading from '@/components/loading.component';
import UpdateModal from '@/components/update-modal.component';
import EventUpdateForm from '@/components/forms/event-update-form.component';
import PaymentForm from '@/components/forms/payment-form.component';
import BridesMaidForm from '@/components/forms/bridesmaid-form.component';

const Events = () => {
  const {user} = useContext(AuthContext);
  
  const toast = useToast();
  // dropdown configuration
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  // dropdown configuration
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

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

  // datepicker state management
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const timestamp = convertDateToTimestamp(date);
  
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [employeeUrl, setEmployeeUrl] = useState('')
  
  // main data hooks
  const [originalData, setOriginalData] = useState([])
  const [data, setData] = useState([]);
  const [url, setURL] = useState(`/event/?skip=0&limit=10&t=${timestamp}&b=${selectedBranch}`);

  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  // modal related hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // modal data fetching purposes
  const [recordId, setRecordId] = useState('');
  const [row, setRow] = useState({})

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //configure role based view
  useEffect(() => {
    const fetchSessionAndConfigure = async () => {
      if(user && user.auth_level && user.auth_level === 5){
          // show dropdowns dep and branch
          setShowBranchDropdown(true);
          setShowDepartmentDropdown(true);
      }else if(user && user.auth_level && user.auth_level === 4){
          // show dep dropdown only.
          setShowDepartmentDropdown(true);
          if(user.branch_id && user.branch_id > 0){
            let bid = user.branch_id;
            
            setSelectedBranch(bid)
          }
      }else if(user && user.auth_level && user.auth_level <= 3){
        // do not show dropdowns.
        if(user.branch_id && user.branch_id > 0){
            let bid = user.branch_id;
  
            setSelectedBranch(bid)
        }
        if(user.department && user.department > 0 && user.department < 4){
          let depId = user.department;
          setSelectedDepartment(depId)
        }else{

        }
      }
    }
    fetchSessionAndConfigure()
  }, [user]);

  

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

  useEffect(() => {
    const configureEmployeeFetchOptions = () => {
      const params = []
      let url = `/employees/?skip=0&limit=100&active=true`
      if (selectedDepartment) {
        //console.log(selectedDepartment)
        params.push(`dep=${selectedDepartment}`);
      }
  
      if (selectedBranch) {
        params.push(`b=${selectedBranch}`);
      }

      if (params.length > 0) {
        url += `&${params.join('&')}`;
      }

      setEmployeeUrl(url);
    }
    configureEmployeeFetchOptions();
  }, [selectedDepartment, selectedBranch]);

  //fetch dropdown data for department
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiClient.get(employeeUrl);
        
        setEmployees(response.data);
      } catch (error) {
        // toast({
        //   title: 'Çalışanlar getirilemedi.',
        //   description: error.response.data.detail,
        //   status: 'error',
        //   //duration: 9000,
        //   isClosable: true,
        // })
        setEmployees([])
      }
    };

    fetchEmployees();
  }, [employeeUrl]);

  const handleEmployeeSelect = (selectedId) => {
    setSelectedEmployee(selectedId);
  };

  //console.log(employees)
  // configure fetch options
  useEffect(() => {

    let newUrl = '/event/?skip=0&limit=50&';
    const params = [];
    
    if (selectedDepartment) {
      params.push(`dep=${selectedDepartment}`);
    }

    if (selectedBranch) {
      params.push(`b=${selectedBranch}`);
    }

    if (date) {
      const timestamp = convertDateToTimestamp(date);
      params.push(`t=${timestamp}`);
    }

    if(selectedEmployee){
      params.push(`eid=${selectedEmployee}`)
    }

    if (params.length > 0) {
      newUrl += `${params.join('&')}`;
    }
    
    setURL(newUrl);

  }, [selectedDepartment, selectedBranch, date, selectedEmployee]);
  

  const handleSelectDate = (selectedDate) => {
    setDate(selectedDate);
  }


  // fetch table data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(url);
        // apply data processing
        let processedData = response.data;

        // format the time attribute
        processedData = processedData.map(item => ({
          ...item,
          SAAT: formatTime(item.SAAT)
        }));

        // Add a new index column
        processedData = processedData.map((item, index) => ({ ...item, "SIRA": index + 1 }));

        setOriginalData(processedData);

        
        if(selectedDepartment === "1" || selectedDepartment === 1){
          // re-format the phone number and country code.
          processedData = validateAndCombineContact(processedData, 'TELEFON', 'ÜLKE KODU');
          
          // re-name necessary columns
          processedData = renameColumn(processedData, 'PERSONEL', 'MAKEUP1');
          processedData = renameColumn(processedData, 'ARTI+', 'GELİN+');
          // define order of the cols
          const order = [
              'SIRA', 'SAAT', 'AD-SOYAD', 'telefon',  'İŞLEM', 'MAKEUP1', 'MAKEUP2', 'SAÇ',
              'GELİN+', 'TST', 'ÜLKE', 'ŞEHİR', 'OTEL', 'KAPORA', 'ÖDEME TİPİ', 'BAKİYE',
                
            ];
          processedData = reorderColumns(processedData, order);
          
          const keysToRemove = ['ÜLKE', 'ŞEHİR', 'OTEL', 'KAPORA', 'ÖDEME TİPİ']

          processedData = removeKeysFromArrayOfObjects(processedData, keysToRemove)

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
        setData(processedData);
        
      } catch (error) {

        console.error('Error fetching departments:', error);
        setData([]);

      }
    }

    fetchData();
  }, [url, isModalOpen, modalContent])
  
  const resetFilters = () => {
    if(user && user.auth_level){
      if(user.auth_level >= 5){
        setSelectedBranch("")
      }
      if(user.auth_level >=4){
        setSelectedDepartment("")
        setSelectedEmployee("")
      }
    }
    setDate(new Date().toISOString().split('T')[0])
  }
  console.log(selectedDepartment)
  console.log(url)
  // define button callbacks
  const handleUpdate = (rowData) => {
    //console.log(rowData);
    const originalRowData = originalData.find((data) => data.SIRA === rowData.SIRA);
    //console.log(originalRowData);
    setRecordId(originalRowData.id)
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
    
    const originalRowData = originalData.find((data) => data.SIRA === rowData.SIRA);
    const response = await apiClient.delete(`/event/${originalRowData.id}`, requestOptions)
  }
  
  // define buttons
  const customButtons = [
    {
        label: 'Güncelle',
        color: 'gray',
        onClick: handleUpdate,
        isDisabled: showDepartmentDropdown === false
    },
    {
        label: 'Sil',
        color: 'red',
        onClick: handleDelete,
        isDisabled: showBranchDropdown === false
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
      newContent: <BridesMaidForm recordId={recordId} initialBranch={selectedBranch} selectedDate={date}/>,
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
    console.log('Form submitted hello world', formData);
    
    try {
      const response = await apiClient.put(`/event/${recordId}`, formData);
      if(response && (response.status === 200 || response.status === 201)){
        handleCloseModal();
        toast({
            title: 'Randevu Başarıyla Güncellendi.',
            //description: `Kalan bakiye: ${response.data.details.remaining_payment}`,
            status: 'success',
            //duration: 9000,
            isClosable: true,
        })
    }
    } catch (error) {
      toast({
        title: 'Randevu Güncellenemedi.',
        description: error.response.data.detail,
        status: 'error',
        //duration: 9000,
        isClosable: true,
      })
    }
  }

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

                  {date ? (
                    <DatePicker selectedDate={date} onSelect={handleSelectDate}/>
                  ):(
                    <Loading/>
                  )}

                  {showDepartmentDropdown && ( // static decision
                    <>
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
                    </>
                  )}

                  {showBranchDropdown && (
                    <>
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
                    </>
                  )}

                  {/* {selectedBranch && selectedDepartment ? (
                    <>
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
                    </>
                    ):(
                      <Text>Filtrelemeye devam etmek için önceki seçimleri yapınız.</Text>
                    )} */}
                  {/* <Button colorScheme='blue' onClick={resetFilters}>RESET</Button> */}
                  <IconButton colorScheme='blue' onClick={resetFilters} icon={<GrPowerReset />} />
                </Stack>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>





      {data ? (
        <ChakraDataTable  obj={data} title={'RANDEVU TAKİP'} showButtons={showBranchDropdown || showDepartmentDropdown} customButtons={customButtons}/>
      ):(
        <Loading/>
      )}
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
  )
}

export default Events;