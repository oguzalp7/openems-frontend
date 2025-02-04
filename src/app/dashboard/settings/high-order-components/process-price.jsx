"use client"
import React, {useState, useEffect, useContext} from 'react'
import ProcessPriceDataTable from '@/components/process-price-data-table.component'
import ChakraDropdown from '@/components/dropdown.component'
import { apiClient } from '@/apiClient'
import Loading from '@/components/loading.component'

import { Box, HStack, VStack, useToast, Button } from '@chakra-ui/react'

import UpdateModal from '@/components/update-modal.component'
import DynamicPriceForm from '@/components/forms/dynamic-price-form.component'
import AuthContext from '@/context/AuthContext'
import InsertModal from '@/components/insert-modal.component'
import DiscountDepartmentForm from '@/components/forms/discount-department-form.component'

const ProcessPrice = () => {
  const {user} = useContext(AuthContext);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  // const url = '/proces-prices/?b=1&dep=1'
  const [fetchURL, setFetchURL] = useState('/proces-prices/?')

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // modal related hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [recordId, setRecordId] = useState('');

  const toast = useToast();

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

  // set branch if necessary
  useEffect(() => {
      if(user && user.branch_id && user.auth_level <= 4){
          setSelectedBranch(user.branchId);
      }
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

  // set department if necessary
  useEffect(() => {
    if(user && user.department && user.auth_level <= 4){
        if(user.department > 3){
            // if(departments && departments[0]){
            //     setSelectedDepartment(departments[0].id);
            // }
        }else{
            setSelectedDepartment(user.department);
        }
    }
  },[user])


  useEffect(() => {
      if(selectedBranch){
          setFetchURL(`/proces-prices/?b=${selectedBranch}`)
          if(selectedDepartment){
              setFetchURL(`/proces-prices/?b=${selectedBranch}&dep=${selectedDepartment}`)
          }
      }else{
          setFetchURL(`/proces-prices/`)
      }
  }, [selectedBranch, selectedDepartment]);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await apiClient.get(fetchURL);
          setData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
    };

    fetchData();
  }, [user, fetchURL, isModalOpen]);

  // define button callbacks
  const handleUpdate = (rowData) => {
    //console.log(rowData)
    setRecordId(rowData.id || rowData.ID)
    setModalContent(rowData)
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setModalContent(null);
      setRecordId('')
  };

  // define buttons
  const customButtons = [
    {
        label: 'Güncelle',
        color: 'gray',
        onClick: handleUpdate,
        isDisabled: false
    },
  ];

  const actionButtons = [
      {
        label: "VAZGEÇ",
        colorScheme: "red",
        onClick: handleCloseModal,
      },
  ];

  const handleSubmit = async (formData) => {
    //console.log('Submitted data: ', formData)
    //console.log(`/proces-prices/update-prices/${recordId}`)
    try {
      const response = await apiClient.put(`/proces-prices/update-prices/${recordId}`, formData);

      handleCloseModal();
      toast({
          title: 'Fiyatlar başarıyla güncellendi.',
          //description: `Kalan bakiye: ${response.data.details.remaining_payment}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
      })
    } catch (error) {
      toast({
          title: 'Fiyatlar güncellenemedi.',
          //description: `Kalan bakiye: ${response.data.details.remaining_payment}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
      })
    }  
  }

  const handleDepartmentDiscount =  async (data) => {
    console.log(data);
    const url = `/discounts/by-attr?d=${data.dep}`;
    try {
        const response = await apiClient.post(url, data.payload);
        toast({
            title: 'İndirim başarıyla eklendi.',
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
        setIsModalOpen(false);
    }
    catch (error) { 
        toast({
            title: 'İndirim eklenemedi.',
            status: 'error',
            duration: 9000,
            isClosable: true,
        })
    }
  }

  return (
    <Box 
        // w={['full', 'full']} 
        //p={[8, 10]}
        // mx='auto'
        // border={['none', 'none']}
        // borderColor={['', 'gray.300']}
        // borderRadius={10}
        w={['sm', 'md', 'lg', 'full']}
        ml={['-15px', '0px', '0px', '0px']}
    >
      <VStack>
          <HStack>
                    {user && user.auth_level > 4 && (<InsertModal buttonTitle="İNDİRİM" >
                            <DiscountDepartmentForm onSubmit={handleDepartmentDiscount} />
                        </InsertModal>
                    )}
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
                    {user && selectedBranch && selectedDepartment && user.auth_level <= 4 && (<InsertModal buttonTitle="İNDİRİM" >
                        şube bazlı bazlı departman filtrelemeli
                    </InsertModal>)}
                    
          </HStack>
          {data && !loading ? (
              <ProcessPriceDataTable data={data} showButtons={true} customButtons={customButtons} />
          ):(
              <Loading />
          )}

          {isModalOpen && modalContent && recordId && (
              <UpdateModal
              isClosed={!isModalOpen}
              contentButtons={[]}
              actionButtons={actionButtons}
              onClose={handleCloseModal}
              >
                  <DynamicPriceForm data={modalContent} onSubmit={handleSubmit} />
              </UpdateModal>
          )}
            
      </VStack>
    </Box>
  )
}

export default ProcessPrice