"use client"
import React, {useState, useEffect, useContext} from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import * as yup from 'yup';
import { apiClient } from '@/apiClient';
import AuthContext from '@/context/AuthContext';
import AdvancedDynamicForm from '../advanced-dynamic-form.component';
import { generateFormConfig, alterFormConfigType, findFieldIndex, renameColumn, renameFormLabels } from '@/utils';




const BridesMaidForm = ({recordId, initialBranch, selectedDate}) => {
    const {user} = useContext(AuthContext);
    
    const [selectedBranch, setSelectedBranch] = useState(initialBranch);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await apiClient.get(`/event/${recordId}`)
                setSelectedBranch(response.data.branch_id)
            } catch (error) {
                console.error(error.response.data.detail)
            }
        }
        if(!initialBranch && user && user.branch_id){
            setSelectedBranch(user.branch_id);
        }else{
            fetchEvent();
        }
    }, [user, initialBranch]);

    // schema state
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
    const [formConfig, setFormConfig] = useState([]);

    // create event details schema from pydantic schema
    const [detailsSchema, setDetailsSchema] = useState(null);
    const [detailsValidationSchema, setDetailsValidationSchema] = useState(yup.object().shape({}));
    const [detailsFormConfig, setDetailsFormConfig] = useState([]);


    const [employees, setEmployees] = useState([]);
    const [hairStylists, setHairStylists] = useState([]);

    // final form config
    const [combinedFormConfig, setCombinedFormConfig] = useState([]);
    const [combinedValidationSchema, setCombinedValidationSchema] = useState(yup.object().shape({}));
    // toast hook
    const toast = useToast();

    useEffect(() => {
        if(!selectedBranch){
            setSelectedBranch(user.branch_id);
        }
    }, [user]);

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
    }, [detailsSchema]);

    

    // fetch schema
    useEffect(() => {   
        const fetchDetailsSchema = async () => {
        
            try {
                const response = await apiClient.get('/event/schema/bridesmaid');
                setDetailsSchema(response.data);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        }
        fetchDetailsSchema();
    }, [user])

    // validate schema
    useEffect(() => {
        if (detailsSchema) {
            const config = generateFormConfig(detailsSchema);
            setDetailsFormConfig(config);

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
    }, [detailsSchema]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=1&active=true&skip=0&limit=100`);
                setEmployees(response.data)
            } catch (error) {
                setEmployees([]);
            }
        }
        fetchEmployees();
    }, [user, selectedBranch]);

    useEffect(() => {
        const fetchHairStylists = async () => {
          
            try{
              const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=2&active=true&skip=0&limit=100`);
              setHairStylists(response.data)
            }catch(e){  
                setHairStylists([])
            }
          }
        fetchHairStylists();
    }, [user, selectedBranch]);

    // combine two forms
    useEffect(()=>{
        const combinedForm = [...formConfig, ...detailsFormConfig]
        setCombinedFormConfig(combinedForm);
        
    }, [formConfig, detailsFormConfig]);

    // combine validation schemas
    useEffect(() => {
        const combinedSchema = validationSchema.concat(detailsValidationSchema);
        setCombinedValidationSchema(combinedSchema);
    }, [validationSchema, detailsValidationSchema]);

    //console.log(combinedFormConfig)

    // keys which will not rendered on the form
    const keysToHidden = ['process_id', 'branch_id', 'status', 'description', 'details', 'date']
    let updatedFormConfig = alterFormConfigType(combinedFormConfig, keysToHidden, 'hidden');
    
    const keysToTime = ['time']
    updatedFormConfig = alterFormConfigType(updatedFormConfig, keysToTime, 'time')
    const labelMapping = {'Time': 'SAAT'}
    updatedFormConfig = renameFormLabels(updatedFormConfig, labelMapping);
    const DropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'employee_id');
    if(updatedFormConfig && updatedFormConfig[DropdownIndex] && updatedFormConfig[DropdownIndex].options){
        if(typeof(updatedFormConfig[DropdownIndex].options) === typeof(employees)){
             updatedFormConfig[DropdownIndex].options = employees;
        }
    }
    const hairDropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'hair_stylist_id');
    if(updatedFormConfig && updatedFormConfig[hairDropdownIndex] && updatedFormConfig[hairDropdownIndex].options){
        if(typeof(updatedFormConfig[DropdownIndex].options) === typeof(employees)){
             updatedFormConfig[hairDropdownIndex].options = hairStylists;
        }
    }
 
    let time = new Date().toISOString().split('T')[1].split('.')[0];
    time = time.substring(0, time.length - 3);
 
    const defaultValues = {
         process_id: 16,
         branch_id: selectedBranch,
         status: "scheduled",
         description: `Bağlı randevu kodu: ${recordId}`,
         details: {},
         date: selectedDate,
         time: time
    }
    
    const handleSubmit = async (data) => {
        

        // Create an object to hold the details
        const details = {hair_stylist_id: data.hair_stylist_id};

        data.details = details

        try {
            const response = await apiClient.post('/event/', data);
            //console.log('Event created:', response.data);
            
            toast({
                    title: 'Nedime Randevusu Başarıyla Oluşturuldu.',
                    description: ``,
                    status: 'success',
                    //duration: 9000,
                    isClosable: true,
            })
            
            
        } catch (error) {
            console.error('Error creating event:', error);
            // console.log(error.response.data.detail);
            toast({
                title: 'Nedime Randevusu Oluşturulamadı.',
                //description: error.response.data.detail,
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
    }

    const handleFormChange = (values) => {
        //console.log(values)
    }

    return (
        <Box w={'full'}>
            <AdvancedDynamicForm formConfig={updatedFormConfig} onSubmit={handleSubmit} onFormChange={handleFormChange} defaultValues={defaultValues}/>
        </Box>
    )
}

export default BridesMaidForm