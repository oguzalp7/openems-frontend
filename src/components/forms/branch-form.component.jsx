"use client"
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '@/context/AuthContext'
import { apiClient } from '@/apiClient'
import { generateFormConfig, alterFormConfigType, findFieldIndex, renameFormLabels } from '@/utils';

import * as yup from 'yup';
import DynamicForm from '../dynamic-form.component';

import { Box, Text, useToast } from '@chakra-ui/react';



const BranchForm = () => {

    const {user} = useContext(AuthContext);

    // toast hook
    const toast = useToast();

    // schema state
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
    const [formConfig, setFormConfig] = useState([]);

    // fetch schema
    useEffect(() => {   
        const fetchSchema = async () => {
           
            try {
                const response = await apiClient.get('/branch/schema/');
                setSchema(response.data);
                console.log(response.data)
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        }
        fetchSchema();
    }, [])
    
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

    // define default values
    const defaultValues = {
        'name': "",
        'is_franchise': true,
        'studio_extra_guest_price': 0,
        'hotel_extra_guest_price': 0,
        'outside_extra_guest_price': 0,
        'outside_country_extra_guest_price': 0,
    }

    const labelMapping = {
        'Name': 'ADI',
        'Is Franchise': 'FRANCHISE',
        'Studio Extra Guest Price': 'STÜDYO GELİN+',
        'Hotel Extra Guest Price': 'OTEL GELİN+ ',
        'Outside Extra Guest Price': 'ŞEHİRDIŞI GELİN+',
        'Outside Country Extra Guest Price': 'YURTDIŞI GELİN+'
      };
     let updatedFormConfig = renameFormLabels(formConfig, labelMapping);
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    
    const onSubmit = async (data) => {
        
        try {
            const response = await apiClient.post('/branch/', data);
            toast({
                title: 'Şube Eklendi',
                description: "Şubeniz Eklendi.",
                status: 'success',
                //duration: 9000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Şube Eklenemedi',
                description: error.response.data.detail,
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
    };

    return (
        <Box>
            {/* check auth & render dynamic form */}
            {user  && user.auth_level >= 5 ? (
                    
                    <DynamicForm schema={validationSchema} formConfig={updatedFormConfig} onSubmit={onSubmit} defaultValues={defaultValues}/>
                ): (
                    <Box>
                        <Text>Bu içeriği görüntüleyemezsiniz.</Text>
                    </Box>
                )
            }
        </Box>
    )
}

export default BranchForm;