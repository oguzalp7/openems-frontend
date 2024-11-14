"use client"

import React, {useState, useEffect, useContext} from 'react'
import { Box, Text, useToast, FormControl, FormLabel, Input, FormErrorMessage, HStack, VStack } from '@chakra-ui/react'
import * as yup from 'yup';
import { apiClient } from '@/apiClient';
import AuthContext from '@/context/AuthContext';
import AdvancedDynamicForm from '../advanced-dynamic-form.component';
import { generateFormConfig, alterFormConfigType, renameFormLabels } from '@/utils';


import { addDays, format, parseISO } from 'date-fns';


const EmployeeDayOffForm = ({employeeId, branchId}) => {
    const {user} = useContext(AuthContext);

    // schema state
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
    const [formConfig, setFormConfig] = useState([]);

    // toast hook
    const toast = useToast();

    const [days, setDays] = useState(1);

    
    const defaultValues = {
        date: new Date().toISOString().split('T')[0],
        time: "00:00",
        process_id: 19,
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
        // console.log(data.date) // variable that holds start date.
        // console.log(days) // number of days that we're going to iterate through.

        // Parse the start date to ensure correct date handling
        const startDate = parseISO(data.date);

        // Generate a list of dates, each incremented by one day from the start date
        const dayOffDates = Array.from({ length: days }, (_, index) => addDays(startDate, index));

        console.log(dayOffDates)
        try {

            // Iterate over each date and make an API request for each
            const requests = dayOffDates.map((date) => {
                // Format each date as "YYYY-MM-DD"
                const formattedDate = format(date, 'yyyy-MM-dd');
                
                // Set the formatted date in the data payload
                const requestData = { ...data, date: formattedDate };

                // Make API request
                return apiClient.post('/event/', requestData);
            });

            // Wait for all requests to complete
            await Promise.all(requests);
            //const response = await apiClient.post('/event/', data);
            //console.log('Event created:', response.data);
            
            toast({
                    title: 'İzin girişi başarılı.',
                    description: ``,
                    status: 'success',
                    //duration: 9000,
                    isClosable: true,
            })
            
            
        } catch (error) {
            console.error('Error creating event:', error);
            // console.log(error.response.data.detail);
            toast({
                title: 'İzin girişi başarısız.',
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
    const keysToHidden = ['process_id', 'branch_id', 'employee_id', 'status', 'details', 'time']
    let updatedFormConfig = alterFormConfigType(formConfig, keysToHidden, 'hidden');
    const labelMapping = {'Date': 'TARİH', 'Description': 'AÇIKLAMA'}
    updatedFormConfig = renameFormLabels(updatedFormConfig, labelMapping);
    console.log(days);
    return (
        <>
        <HStack align="start">
            <VStack align="start">
                <FormLabel>
                    <Text  as="b">{'GÜN'.toUpperCase()}:</Text>
                </FormLabel>
            </VStack>
            <VStack w={['full']}  align="start">
                <Input type='number' value={days} onChange={(e) => {setDays(e.target.value)}} />
                
            </VStack>
        </HStack>
        <br/>
        <AdvancedDynamicForm formConfig={updatedFormConfig} onSubmit={handleSubmit} onFormChange={handleFormChange} defaultValues={defaultValues}/>
        </>
    )
}

export default EmployeeDayOffForm