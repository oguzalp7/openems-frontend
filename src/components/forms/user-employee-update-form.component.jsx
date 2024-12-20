"use client"

import React, { useEffect, useState, useContext } from 'react'
import AuthContext from '@/context/AuthContext'
import { apiClient } from '@/apiClient'
import { Box, Text, useToast, HStack, Button, Divider } from '@chakra-ui/react';
import * as yup from 'yup';
import { generateFormConfig, alterFormConfigType, findFieldIndex, renameFormLabels } from '@/utils';
import Loading from '../loading.component';
import AdvancedDynamicForm from '../advanced-dynamic-form.component';
import EmployeeDayOffForm from './employee-dayoff-form.component';
import EmployeeMeetingForm from './employee-meeting-form.component';


const UserEmployeeUpdateForm = ({initialValues, recordId, submitHandler}) => {
    const {user} = useContext(AuthContext);
    // define default values
    const defaultValues = initialValues || {
        'is_active': true,
        'employment_start_date': new Date().toISOString().split('T')[0],
        'employment_status': true,
        'balance': 0,
        'password': '123456',
        'country_code': "+90"
    }

    
    // schema state
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
    const [formConfig, setFormConfig] = useState([]);

    // useState hooks for the dropdown selection options
    const [auths, setAuths] = useState([]);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);

    // toast hook
    const toast = useToast();

    const [showForm, setShowForm] = useState(true);
    const [showDayOff, setShowDayOff] = useState(false);
    const [showMeeting, setShowMeeting] = useState(false);

    // ------------------------------------------------------------------------------------------------------------------------------------------------
    // fetch dropdown options
    useEffect(()=>{
        
        const fetchBranches = async () =>{
            try {
                const response = await apiClient.get('/branch/?skip=0&limit=50');
                
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setBranches([])
            }
        }
        fetchBranches(); 
    }, [user]);
    

    useEffect(() => {
        const fetchAuths = async () => {
            try {
                const response = await apiClient.get('/auth/?skip=0&limit=10');
                
                setAuths(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setAuths([])
            }
        }
        fetchAuths();
    }, [user]);


    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await apiClient.get('/departments/?skip=0&limit=50');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setDepartments([])
            }
        }
        fetchDepartments();
    }, [user]);
    

    useEffect(() => {
        const fetchEmploymentTypes = async () => {
            try {
                const response = await apiClient.get('/employment-types/?skip=0&limit=10');
                
                setEmploymentTypes(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setEmploymentTypes([])
            }
        }
        fetchEmploymentTypes();
    }, [user])

    // ------------------------------------------------------------------------------------------------------------------------------------------------
    
    // fetch schema
    useEffect(() => {   
        const fetchSchema = async () => {
            try {
                const response = await apiClient.get('/user-employee/update-schema/');
                setSchema(response.data);
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

    // keys which will not rendered on the form
    const keysToHidden = []

    // hide the keys and values from the form
    let updatedFormConfig = alterFormConfigType(formConfig, keysToHidden, 'hidden');
    // ------------------------------------------------------------------------------------------------------------------------------------------------

    // load dropdown options
   
    const branchDropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'branch_id');
    if(updatedFormConfig && updatedFormConfig[branchDropdownIndex] && updatedFormConfig[branchDropdownIndex].options){
        if(typeof(updatedFormConfig[branchDropdownIndex].options) === typeof(branches)){
            updatedFormConfig[branchDropdownIndex].options = branches;
        }
    }
    
    
    
    const departmentDropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'department_id');
    //console.log(updatedFormConfig[branchDropdownIndex])
    if(updatedFormConfig && updatedFormConfig[departmentDropdownIndex] && updatedFormConfig[departmentDropdownIndex].options){
        if(typeof(updatedFormConfig[departmentDropdownIndex].options) === typeof(departments)){
            updatedFormConfig[departmentDropdownIndex].options = departments;
        }
    }



    const authDropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'auth_id');
    //console.log(updatedFormConfig[branchDropdownIndex])
    if(updatedFormConfig && updatedFormConfig[authDropdownIndex] && updatedFormConfig[authDropdownIndex].options){
        if(typeof(updatedFormConfig[authDropdownIndex].options) === typeof(auths)){
            updatedFormConfig[authDropdownIndex].options = auths;
        }
    }
    

    
    const empoymentTypeDropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'employment_type_id');
    //console.log(updatedFormConfig[branchDropdownIndex])
    if(updatedFormConfig && updatedFormConfig[empoymentTypeDropdownIndex] && updatedFormConfig[empoymentTypeDropdownIndex].options){
        if(typeof(updatedFormConfig[empoymentTypeDropdownIndex].options) === typeof(employmentTypes)){
            updatedFormConfig[empoymentTypeDropdownIndex].options = employmentTypes;
        }
    }
    

    const labelMapping = {
        "Username": 'KULLANICI ADI',
        "Password": 'ŞİFRE',
        'Is Active': 'AKTİFLİK',
        "Name": 'AD-SOYAD',
        'Country Code': 'ÜLKE KODU',
        'Phone Number': 'TELEFON',
        'Job Title': 'İŞ TANIMI',
        "Employment Start Date": 'İŞ BAŞLANGIÇ TARİHİ',
        "Salary": 'MAAŞ',
        'Balance': 'BAKİYE',
        'Employment Status': 'ÇALIŞMA DURUMU'
      };
    updatedFormConfig = renameFormLabels(updatedFormConfig, labelMapping);

    const onSubmit = async (data) => {
        
        submitHandler(data)
    }

    const handleDayOff = async () => {
        setShowForm(false);
        setShowDayOff(true);
        setShowMeeting(false);
        //console.log(recordId);
    }

    const handleMeeting = async () => {
        setShowForm(false);
        setShowDayOff(false);
        setShowMeeting(true);
        //console.log(recordId);
    }


    const handleShowForm = async () => {
        setShowForm(true);
    }

    const handleResetPassword = async () => {
        
        try {
            const response = await apiClient.get(`/user/password/reset/${recordId}`)
            console.log(response.data)
        } catch (error) {
            toast({
                title: 'Şifre resetlenemedi.',
                description: error.response.data.detail,
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
    }

    return(
        <Box>
            {/* check auth & render dynamic form */}
            {user && user.auth_level >= 4 ? (
                    <>
                    {branches && auths && departments && employmentTypes ? (
                        <Box>
                            <HStack w={'full'}>
                                
                                
                                {!showForm ? (
                                    <Box w={'full'}>
                                        <Button w={'full'} colorScheme={'orange'} onClick={handleShowForm}>GERİ</Button>
                                        
                                    </Box>
                                ): (
                                    <>
                                    <Button colorScheme={'teal'} w={'full'} onClick={handleDayOff}>İZİN</Button>
                                    <Button colorScheme={'blue'} w={'full'} onClick={handleMeeting}>TOPLANTI</Button>
                                    <Button colorScheme={'purple'} w={'full'} onClick={handleResetPassword}>ŞİFRE RESETLE</Button>
                                    </>
                                )}
                            </HStack>
                            <br/>
                            {showForm ? (
                                <AdvancedDynamicForm  formConfig={updatedFormConfig} onSubmit={onSubmit} defaultValues={defaultValues} onFormChange={(data) => {console.log(data)}}/>
                            ):(
                                <>
                                {showDayOff && (
                                    <EmployeeDayOffForm employeeId={recordId} branchId={defaultValues.branch_id}/>
                                )}
                                {showMeeting && (
                                    <EmployeeMeetingForm employeeId={recordId} branchId={defaultValues.branch_id}/>
                                )}
                                </>
                                
                            )}
                        </Box>
                    ):(
                        <Loading/>
                    )}
                    </>
                ): (
                    <Box>
                        <Text>Bu içeriği görüntüleyemezsiniz.</Text>
                    </Box>
                )
            }
        </Box>
       
    );
}

export default UserEmployeeUpdateForm