"use client"
import React, {useState, useEffect, useContext} from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import * as yup from 'yup';
import { apiClient } from '@/apiClient';
import { generateFormConfig, alterFormConfigType, findFieldIndex, renameFormLabels } from '@/utils';
import AuthContext from '@/context/AuthContext';
import AdvancedDynamicForm from '../advanced-dynamic-form.component';


const PaymentForm = ({remainingPayment, recordId}) => {
    const {user} = useContext(AuthContext);

    // schema state
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
    const [formConfig, setFormConfig] = useState([]);

    const [paymentTypes, setPaymentTypes] = useState([]);

    // toast hook
    const toast = useToast();

    // fetch schema
    useEffect(() => {   
        const fetchSchema = async () => {
        
            try {
                const response = await apiClient.get('/payments/schema/');
                setSchema(response.data);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        }
        fetchSchema();
    }, [user]);

    // validate schema
    useEffect(() => {
        if (schema) {
            const config = generateFormConfig(schema);
            setFormConfig(config);

            // Convert the schema to Yup schema for validation
            const yupSchema = yup.object().shape(
                Object.keys(schema.properties).reduce((acc, key) => {
                    const field = schema.properties[key];
                    if (field.type === 'string' && field.minLength) {
                    acc[key] = yup.string().min(field.minLength).required();
                    } else if (field.type === 'integer') {
                    acc[key] = yup.number().integer().required();
                    } else if (field.type === 'boolean') {
                    acc[key] = yup.boolean().required();
                    } else if (field.type === 'number') {
                    acc[key] = yup.number().required();
                    } else {
                    acc[key] = yup.string().required();
                    }
                    return acc;
                }, {})
            );

            setValidationSchema(yupSchema);
        }
    }, [schema]);

    useEffect(() => {
        const fetchPaymentTypes = async () => {
            try {
                const response = await apiClient.get('/payment-types/?skip=0&limit=100');
                setPaymentTypes(response.data);
            } catch (error) {
                setPaymentTypes([]);
            }
        }

        fetchPaymentTypes();
    }, [user]);

    // keys which will not rendered on the form
    const keysToHidden = ['event_id']
    let updatedFormConfig = alterFormConfigType(formConfig, keysToHidden, 'hidden');

    const labelMapping = {
        'Amount': 'MİKTAR'
    }

    updatedFormConfig = renameFormLabels(updatedFormConfig, labelMapping);

    const paymentTypeDropdownIndex = findFieldIndex(updatedFormConfig, 'select', "payment_type_id");
    if(updatedFormConfig && updatedFormConfig[paymentTypeDropdownIndex] && updatedFormConfig[paymentTypeDropdownIndex].options){
        if(typeof(updatedFormConfig[paymentTypeDropdownIndex].options) === typeof(paymentTypes)){
            updatedFormConfig[paymentTypeDropdownIndex].options = paymentTypes;
        }
    }

    const defaultValues = {
        event_id: recordId,
        amount: 0,
        payment_type_id: ""
    }

    const handleSubmit = async (data) => {
        const postData = async () => {
            try {
                const response = await apiClient.post('/payments/', data);
               
                toast({
                    title: 'Ödeme Kaydı Oluşturuldu.',
                    description: `Ödenen miktar: ${data.amount} TL.`,
                    status: 'success',
                    //duration: 9000,
                    isClosable: true,
                })
                
            } catch (error) {
                if(error.response && error.response.data && error.response.data.detail){
                    toast({
                        title: 'Ödeme Kaydı Oluşturulamadı.',
                        description: error.response.data.detail,
                        status: 'error',
                        //duration: 9000,
                        isClosable: true,
                    })
                }
            }
        }
        postData();
    };

    const handleFormChange = (values) => {
        //console.log(values)
    }
    
    return (
        <Box w={'full'}>
            <Text as={'b'} fontSize={'lg'}>Kalan Ödeme: {remainingPayment} TL</Text>
            {/* <DynamicForm schema={validationSchema} formConfig={updatedFormConfig} defaultValues={defaultValues} onSubmit={onSubmit}/> */}
            <AdvancedDynamicForm formConfig={updatedFormConfig} onSubmit={handleSubmit} onFormChange={handleFormChange} defaultValues={defaultValues}/>
        </Box>
    )
}

export default PaymentForm