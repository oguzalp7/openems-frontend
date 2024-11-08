"use client"

import React, {useState, useEffect, useContext} from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import * as yup from 'yup';
import { apiClient } from '@/apiClient';
import AuthContext from '@/context/AuthContext';
import AdvancedDynamicForm from '../advanced-dynamic-form.component';
import { generateFormConfig, alterFormConfigType, renameFormLabels } from '@/utils';

const EmployeeMeetingForm = ({employeeId, branchId}) => {
    const {user} = useContext(AuthContext);

    // schema state
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
    const [formConfig, setFormConfig] = useState([]);

    // toast hook
    const toast = useToast();

    const defaultValues = {
        date: new Date().toISOString().split('T')[0],
        time: "08:00",
        process_id: 20,
        branch_id: branchId,
        employee_id: employeeId,
        status: "scheduled",
        details: {}
    }

    // fetch schema
    useEffect(() => {   
        const fetchSchema = async () => {
        
            try {
                const response = await apiClient.get('/event/schema/base/');
                setSchema(response.data);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        }
        fetchSchema();
    }, [user])

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

    
    const handleSubmit = async (data) => {
        //console.log(data)
        try {
            const response = await apiClient.post('/event/', data);
            //console.log('Event created:', response.data);
            
            toast({
                    title: 'Toplantı girişi başarılı.',
                    description: ``,
                    status: 'success',
                    //duration: 9000,
                    isClosable: true,
            })
            
            
        } catch (error) {
            console.error('Error creating event:', error);
            // console.log(error.response.data.detail);
            toast({
                title: 'Toplantı girişi başarısız.',
                description: error.response.data.detail,
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
    }

    const handleFormChange = (values) => {
        //console.log(values)
    }

    // keys which will not rendered on the form
    const keysToHidden = ['process_id', 'branch_id', 'employee_id', 'status', 'details']
    let updatedFormConfig = alterFormConfigType(formConfig, keysToHidden, 'hidden');
    const labelMapping = {'Date': 'TARİH', 'Description': 'AÇIKLAMA', 'Time': 'SAAT'}
    updatedFormConfig = renameFormLabels(updatedFormConfig, labelMapping);

    return (
        <AdvancedDynamicForm formConfig={updatedFormConfig} onSubmit={handleSubmit} onFormChange={handleFormChange} defaultValues={defaultValues}/>
    )
}

export default EmployeeMeetingForm