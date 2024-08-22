"use client"
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '@/context/AuthContext'
import ChakraDataTable from '@/components/data-table.component'
import UpdateModal from '@/components/update-modal.component'
import { apiClient } from '@/apiClient'
import { Box, useToast, HStack, VStack } from '@chakra-ui/react'
import InsertModal from '@/components/insert-modal.component'
import DynamicUpdateForm from '@/components/dynamic-update-form.component'

const BaseHOC = ({form, slug, tableTitle, fetchUrl, updateForm }) => {

    const {user} = useContext(AuthContext);

    // toast hook
    const toast = useToast();

    const [data, setData] = useState([]);
    const [recordId, setRecordId] = useState('');

    // modal related hooks
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            
            const response = await apiClient.get(fetchUrl);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setData([]);
        }
        };
        
        fetchData();
        
    }, [user, isModalOpen, fetchUrl]);

    // define button callbacks
    const handleUpdate = (rowData) => {
        
        setRecordId(rowData.id || rowData.ID)
        console.log(`${slug}/${recordId}`)
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchRecordById = async () => {
          try{
            if(recordId){
              const response = await apiClient.get(`${slug}/${recordId}`);
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
        alert('Silme işlemi aktif değildir.');
        
    }

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
        {
            label: 'Sil',
            color: 'red',
            onClick: handleDelete,
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
        try {
            const response = await apiClient.put(`${slug}/${recordId}`, formData);
            toast({
                title: 'İşlem Başarılı',
                //description: `Kalan bakiye: ${response.data.details.remaining_payment}`,
                status: 'success',
                //duration: 9000,
                isClosable: true,
            })
            handleCloseModal();
        } catch (error) {
            toast({
                title: 'İşlem Başarısız.',
                description: error.response.data.detail,
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
 
    }

    return (
        <Box
        w={['sm', 'md', 'lg', '8xl']}
        >
            {form && (
                <VStack>
                    <HStack>
                        <InsertModal buttonTitle={tableTitle}>
                            {form}
                        </InsertModal>
                    </HStack>
                </VStack>
            )}
            
            <br/>
            {data ? (
                <ChakraDataTable  obj={data} title={tableTitle} showButtons={true} customButtons={customButtons}/>
            ):(
                <Loading/>
            )}
            

            {isModalOpen && modalContent && (
                <UpdateModal
                isClosed={!isModalOpen}
                contentButtons={[]}
                actionButtons={actionButtons}
                onClose={handleCloseModal}
                >
                    {updateForm ? (
                        <div>{React.cloneElement(updateForm, {initialValues: modalContent, recordId: recordId, submitHandler: handleSubmit})}</div>
                    ):(
                        <DynamicUpdateForm onSubmit={handleSubmit} defaultValues={modalContent} recordId={recordId} schemaUrl={`${slug}/schema/`}/>
                    )}
                </UpdateModal>
            )}
        </Box>
    )
}

export default BaseHOC;