"use client"

import React, { useEffect, useState, useContext } from 'react'
import AuthContext from '@/context/AuthContext';
import Loading from '../loading.component';
import { apiClient } from '@/apiClient';
import useToggleSwitch from '@/hooks/useToggleSwitch';
import NeonToggleSwitch from '../neon-switch.component';
import { Box, HStack, VStack, Text, InputGroup, Input, InputLeftAddon, FormLabel, Button, useToast } from '@chakra-ui/react'
import ChakraDropdown from '../dropdown.component';
import * as yup from 'yup';
import AdvancedDynamicForm from '../advanced-dynamic-form.component';

import {generateFormConfig, findFieldIndex, updateFieldOptions, alterFormConfigType, renameFormLabels, reorderFormConfig, excludeItem} from "../../utils"




const EventForm = () => {
    const {user} = useContext(AuthContext);

    const [isOn, toggleSwitch] = useToggleSwitch();
    const toast = useToast();

    // for higher level auth users
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    // fetch departments for dropdown or tab component
    const [showDepartments, setShowDepartments] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // create base event schema from pydantic schema
    const [baseSchema, setBaseSchema] = useState(null);
    const [baseValidationSchema, setBaseValidationSchema] = useState(yup.object().shape({}));
    const [baseFormConfig, setBaseFormConfig] = useState([]);    

    // create event details schema from pydantic schema
    const [detailsSchema, setDetailsSchema] = useState(null);
    const [detailsValidationSchema, setDetailsValidationSchema] = useState(yup.object().shape({}));
    const [detailsFormConfig, setDetailsFormConfig] = useState([]);

    // final form config
    const [combinedFormConfig, setCombinedFormConfig] = useState([]);
    const [combinedValidationSchema, setCombinedValidationSchema] = useState(yup.object().shape({}));

    const [paymentTypes, setPaymentTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesHair, setEmployeesHair] = useState([]);

    const [countryCode, setCountryCode] = useState('+90');
    const [customerPhone, setCustomerPhone] = useState('5')
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [insertCustomer, setInsertCustomer] = useState(false);

    const [remainingPayment, setRemainingPayment] = useState(0);

    // process time for current time
    let time = new Date().toISOString().split('T')[1].split('.')[0];
    time = time.substring(0, time.length - 3);
    const [baseDefaultValues, setBaseDefaultValues] = useState({})

    
    // configure branch dropdown
    useEffect(()=>{
        if(user && user.auth_level && user.auth_level === 5){
            setShowBranchDropdown(true);
        }
    }, [user, user.auth_level]);

    // fetch branches if necessary
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
        if (showBranchDropdown) {
            fetchBranches();
        }
    }, [user, showBranchDropdown]);

    // set branch if necessary
    useEffect(() => {
        if(user && user.branch_id && user.auth_level <= 4){
            setSelectedBranch(user.branch_id);
        }
    }, [user]);
    
    const handleSelectBranch = (selectedId) => {
        setSelectedBranch(selectedId);
    };

    useEffect(() => {
        if(selectedBranch){
            setBaseDefaultValues({
                status: 'scheduled',
                description: ' ',
                branch_id: selectedBranch,
                date: new Date().toISOString().split('T')[0],
                time: time,
                details: '{}',
                remaining_payment: 0,
            })
        }
    }, [selectedBranch])

    // configure departments dropdown
    useEffect(()=>{
        if(user && user.auth_level && user.auth_level > 3){
            setShowDepartments(true);
        }
    }, [user, user.auth_level]);

    useEffect(() => {
        const fetchDepartmentsByBranch = async () => {
            try {
                const response = await apiClient.get(`/branch/offline/${selectedBranch}`);
                setDepartments(response.data.departments)
            } catch (error) {
                setDepartments([{id: -1, name: 'fetch error'}])
            }
        }
        if(showDepartments){
            fetchDepartmentsByBranch();
        }
    }, [user, selectedBranch]);

    const handleDepartmentSelect = (selectedId) => {
        setSelectedDepartment(selectedId);
    };
    
    // set department if necessary
    useEffect(() => {
        if(user && user.department && user.aut_level <= 4){
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
        if(selectedDepartment){
            if(selectedDepartment === '1' || selectedDepartment === '3'){
                setBaseDefaultValues({
                    status: 'scheduled',
                    description: ' ',
                    branch_id: selectedBranch,
                    date: new Date().toISOString().split('T')[0],
                    time: time,
                    details: '{}',
                    plus: "0",
                    remaining_payment: 0,
                    downpayment: "0"
                })
            }
        }
    }, [selectedDepartment])

    useEffect(() => {
        setBaseDefaultValues(
            {
                status: 'scheduled',
                description: ' ',
                branch_id: selectedBranch,
                date: new Date().toISOString().split('T')[0],
                time: time,
                details: '{}',
                plus: "0",
                customer_id: customerId,
                remaining_payment: 0,
                num_nail_arts: "0",
            }
        )

    }, [selectedBranch, selectedDepartment, customerId]);

    // fetch base schema
    useEffect(() => {
        const fetchBaseSchema = async () => {
        
        try {
            const response = await apiClient.get('/event/schema/base/');
            setBaseSchema(response.data);
        } catch (err) {
            setBaseSchema(null);
        }
        };
        fetchBaseSchema();
    }, []);

    // validate base schema
    useEffect(() => {
        if (baseSchema) {
        const config = generateFormConfig(baseSchema);
        setBaseFormConfig(config);

        // Convert the schema to Yup schema for validation
        const yupSchema = yup.object().shape(
            Object.keys(baseSchema.properties).reduce((acc, key) => {
            const field = baseSchema.properties[key];
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

        // set base validation schema
        setBaseValidationSchema(yupSchema);
        }
    }, [baseSchema]);

    // Fill the options for base schema
    // Fetch and set options for process_id
    useEffect(() => {
        const updateOptions = async () => {
        if (selectedDepartment) {
            const response = await apiClient.get(`/processes/?dep=${selectedDepartment}&skip=0&limit=150`);
            let excludedData = response.data
            if(selectedDepartment === 3 || selectedDepartment === '3'){
                excludedData = excludeItem(response.data, 'ADI', 'NAIL-ART')
            }else if(selectedDepartment === 1 || selectedDepartment === '1'){
                excludedData = excludeItem(response.data, 'ADI', 'GELİN+')
            }
            
            setBaseFormConfig((prevConfig) => {
            const updatedConfig = [...prevConfig];
            const ddIndex = findFieldIndex(updatedConfig, 'select', 'process_id');
            if (ddIndex !== -1) {
                updatedConfig[ddIndex].options = excludedData;
            }
            return updatedConfig;
            });
        }
        };
        updateOptions();
    }, [user, selectedDepartment]);

    // Fetch and set options for employee_id
    useEffect(() => {
        const updateEmployeeOptions = async () => {
        if (selectedBranch && selectedDepartment) {
            const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=${selectedDepartment}&active=true&skip=0&limit=100`);
            setEmployees(response.data)
            setBaseFormConfig((prevConfig) => {
            const updatedConfig = [...prevConfig];
            const ddIndex = findFieldIndex(updatedConfig, 'select', 'employee_id');
            if (ddIndex !== -1) {
                updatedConfig[ddIndex].options = response.data;
            }
            return updatedConfig;
            });
        }
        };
        updateEmployeeOptions();
    }, [user, selectedBranch, selectedDepartment]);

     // fetch details schema
     useEffect(() => {
        const fetchDetailsSchema = async () => {
            try {
                const response = await apiClient.get(`/event/schema/details/${selectedDepartment}`);
                setDetailsSchema(response.data);
            } catch (err) {
                setDetailsSchema(null);
            }
        };
        fetchDetailsSchema();
    }, [user, selectedDepartment]);

    
    

    // validate details schema
    useEffect(() => {
        if (detailsSchema) {
        const config = generateFormConfig(detailsSchema);
        setDetailsFormConfig(config);

        // Convert the schema to Yup schema for validation
        const yupSchema = yup.object().shape(
            Object.keys(detailsSchema.properties).reduce((acc, key) => {
            const field = detailsSchema.properties[key];
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

        // set base validation schema
        setDetailsValidationSchema(yupSchema);
        }
    }, [detailsSchema]);

    useEffect(() => {
        const fetchHairStylists = async () => {
          
          try{
            const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=2&active=true&skip=0&limit=100`);
            setEmployeesHair(response.data)
          }catch(e){  
            setEmployeesHair([])
          }
        }
    
        if(selectedDepartment === '1' || selectedDepartment === 1){
          fetchHairStylists();
        }
        
    }, [selectedDepartment, selectedBranch]);

    // fetch payment types if downpayment required
    useEffect(() => {
        const fetchPaymentTypes = async () => {
        try {
            const response = await apiClient.get('/payment-types/?skip=0&limit=100');
            setPaymentTypes(response.data);
        } catch (error) {
            setPaymentTypes([])
        }
        }
        if((selectedDepartment === '1' || selectedDepartment === 1) && selectedDepartment){
            fetchPaymentTypes();
        }
    
    }, [user, selectedDepartment])
    
    // combine two forms
    useEffect(()=>{
        const combinedForm = [...baseFormConfig, ...detailsFormConfig]
        setCombinedFormConfig(combinedForm);
        
    }, [baseFormConfig, detailsFormConfig]);

    // combine validation schemas
    useEffect(() => {
        const combinedSchema = baseValidationSchema.concat(detailsValidationSchema);
        setCombinedValidationSchema(combinedSchema);
    }, [baseValidationSchema, detailsValidationSchema]);

    let updatedFormConfig = [...combinedFormConfig]

    

    if(selectedDepartment === '1' || selectedDepartment === 1){
        const paymentTypeDropdownIndex = findFieldIndex(updatedFormConfig, 'select', "payment_type_id");
        if(updatedFormConfig && updatedFormConfig[paymentTypeDropdownIndex] && updatedFormConfig[paymentTypeDropdownIndex].options){
          if(typeof(updatedFormConfig[paymentTypeDropdownIndex].options) === typeof(paymentTypes)){
              updatedFormConfig[paymentTypeDropdownIndex].options = paymentTypes;
          }
        }

        const hairDropdownIndex = findFieldIndex(updatedFormConfig, 'select', "hair_stylist_id");
        if(updatedFormConfig && updatedFormConfig[hairDropdownIndex] && updatedFormConfig[hairDropdownIndex].options){
            if(typeof(updatedFormConfig[hairDropdownIndex].options) === typeof(employeesHair)){
                updatedFormConfig[hairDropdownIndex].options = employeesHair;
            }
        }

        const optionalEmployeeIndex = findFieldIndex(updatedFormConfig, 'select', 'optional_makeup_id');
        if(updatedFormConfig && updatedFormConfig[optionalEmployeeIndex] && updatedFormConfig[optionalEmployeeIndex].options){
            if(typeof(updatedFormConfig[optionalEmployeeIndex].options) === typeof(employees)){
                updatedFormConfig[optionalEmployeeIndex].options = employees;
            }
        }
    }

   
    // keys which will not rendered on the form
    const keysToHidden = ['status', 'details', 'customer_id', 'branch_id']
    
    // // hide the keys and values from the form
    updatedFormConfig = alterFormConfigType(updatedFormConfig, keysToHidden, 'hidden');

    // // found a bug on the pipeline, num_nail_arts was treated as foreign key.
    const keysToNumber = ['num_nail_arts', 'plus'];
    updatedFormConfig = alterFormConfigType(updatedFormConfig, keysToNumber, 'number');

    const keysToTime = ['time'];
    updatedFormConfig = alterFormConfigType(updatedFormConfig, keysToTime, 'time');

    // make renaming
    const labelMapping = {
        'Date': 'TARİH*',
        'Time': 'SAAT*',
        'Description': 'AÇIKLAMA',
        'Is Tst': 'TST',
        'Downpayment': 'KAPORA*',
        'Plus': 'GELİN+',
        'Remaining Payment': 'BAKİYE',
        'Country': 'ÜLKE',
        'City': 'ŞEHİR',
        'Hotel': 'OTEL',
        'Num Nail Arts': 'NAİLART+'
    }
    updatedFormConfig = renameFormLabels(updatedFormConfig, labelMapping);
    
    if(selectedDepartment === '1' || selectedDepartment === '2'){
        const order = [
            "date",
            "time",
            "process_id",
            "plus",
            "is_tst",
            "employee_id",
            "optional_makeup_id",
            "hair_stylist_id",
            "downpayment",
            "payment_type_id",
            "description",
            "remaining_payment",
            "hotel",
            "city",
            "country",
            "branch_id",
            "customer_id",
            "status",
            "details",
        ]
        // re-order form inputs
        updatedFormConfig = reorderFormConfig(updatedFormConfig, order);
    }else if(selectedDepartment === '3') {
        const order = [
            "date",
            "time",
            "process_id",
            "num_nail_arts",
            "employee_id",
            "description",
            "remaining_payment",
        ]
        //console.log(detailsValidationSchema._nodes)
        updatedFormConfig = reorderFormConfig(updatedFormConfig, order);
    }

    useEffect(() => {
        const queryCustomer = async () => {
            try {
                const encodedCountryCode = encodeURIComponent(countryCode);
                const response = await apiClient.get(`/customer/get/?country_code=${encodedCountryCode}&phone_number=${customerPhone}`);
                setCustomerName(response.data.name);
                setCustomerId(response.data.id);
                setInsertCustomer(false);

                
                
              } catch (error) {
                if (error.response && error.response.status === 404) {
                  console.log('Customer not found, ready to add a new one.');
                  setInsertCustomer(true);
                } else {
                  console.error('Error querying customer:', error);
                }
              }
          
        };
        if (countryCode.length >= 2 && customerPhone.length === 10) {
            queryCustomer();
        }
    }, [countryCode, customerPhone]);

    useEffect(() => {
        if(customerId){
            setInsertCustomer(false);
        }
    }, [customerId]);


    const handleSubmit = async (formData) => {
        const insertNewCustomer = async () => {
            const data = {
                name: customerName,
                country_code: countryCode,
                phone_number: customerPhone,
                black_listed: false,
                events: {
                    past_events: []
                }
            }
            try {
                const response = await apiClient.post('/customer/', data);
                if(response.status == 201 || response.status === 200 && !customerId){
                    setCustomerId(response.data.id)
                    return response.data.id;
                }
            } catch (error) {
                console.error(error)
            }
            
        }
        if(insertCustomer && customerName){
            const custId = await insertNewCustomer();
            formData['customer_id'] = custId;
        }else if(!insertCustomer && customerId){
            formData['customer_id'] = customerId;
        }
        // Create an object to hold the details
        const details = {};
        //console.log(formData)
        // Iterate through the form data keys
        for (const key in formData) {
            if (detailsValidationSchema._nodes.includes(key)) {
                // If the key is in the details schema, add it to the details object
                details[key] = formData[key];
            }
        }

        // Remove keys that are part of the details schema from the formData
        const filteredFormData = Object.keys(formData)
            .filter(key => !detailsValidationSchema._nodes.includes(key))
            .reduce((obj, key) => {
                obj[key] = formData[key];
                return obj;
            }, {});

        // Set the details object in the filtered form data
        filteredFormData.details = details;

        
        try {
            const response = await apiClient.post('/event/', filteredFormData);
            // console.log('Event created:', response.data);
            if(response && (response.status === 200 || response.status === 201)){
                toast({
                    title: 'Randevu Başarıyla Oluşturuldu.',
                    description: `
                                Tarih: ${response.data.date}\n
                                Kalan bakiye: ${response.data.details.remaining_payment}
                    `,
                    // description: (
                    //     <>
                    //       Tarih: {response.data.date},<br />
                    //       Saat: {response.data.time}, <br/>
                    //       Kalan bakiye: {response.data.details.remaining_payment}
                    //     </>
                    //   ),
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
            if(!isOn){
                resetForm();
            }
        } catch (error) {
            console.error('Error creating event:', error);
            //console.log(error.response.data.detail);
            toast({
                title: 'Randevu Oluşturulamadı.',
                //description: JSON.stringify(error.response.data.detail, null, 2),
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
    }

    const handleFormChange = async (formData) => {
        
        // Create an object to hold the details
        const details = {};
        //(formData)
        // Iterate through the form data keys
        for (const key in formData) {
            if (detailsValidationSchema._nodes.includes(key)) {
                // If the key is in the details schema, add it to the details object
                details[key] = formData[key];
            }
        }

        // Remove keys that are part of the details schema from the formData
        const filteredFormData = Object.keys(formData)
            .filter(key => !detailsValidationSchema._nodes.includes(key))
            .reduce((obj, key) => {
                obj[key] = formData[key];
                return obj;
            }, {});

        // Set the details object in the filtered form data
        filteredFormData.details = details;

        

        // const session = await getPlainSession();
        // const requestOptions = {
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${session.token}`,
        //         },
        //     }
        

        const response = await apiClient.post('/event/rp/', filteredFormData)
        //console.log(response.data)
        setRemainingPayment(response.data);
        
        
    }

    useEffect(() => {
        setBaseDefaultValues(() => ({
            remaining_payment: remainingPayment
        }))

    }, [remainingPayment])


    const resetForm = () => {
        setCountryCode('+90');
        setCustomerPhone('5');
        setCustomerName('');
        setCustomerId('')
        setBaseDefaultValues(
            {
                status: 'scheduled',
                description: ' ',
                branch_id: selectedBranch,
                date: new Date().toISOString().split('T')[0],
                time: time,
                details: '{}',
                plus: "0",
                customer_id: customerId,
                optional_makeup_id: '',
                hair_stylist_id: '',
                process_id: '',
                employee_id: '',
                is_tst: false,
                payment_type_id: '',
                downpayment: "0",
                remaining_payment: 0
            }
        )
    }

    return(
        <Box>
            <VStack>
                <HStack>
                {user && showBranchDropdown && (
                    <>
                        {branches ? (
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
                    </>
                )}
                {user && selectedBranch && (
                    <>
                        {showDepartments && (
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
                    </>
                )}

                <Button onClick={resetForm}>RESET</Button> 
                <Box mb={2}>
                    <NeonToggleSwitch isOn={isOn} toggleSwitch={toggleSwitch} />
                </Box>
                </HStack>
            </VStack>

            <br />
            <Box w={['xs', 'sm', 'md', 'md']}>
                <hr />
                <br />
                {/* check auth & render dynamic form */}
                {user && user.auth_level >= 3 && updatedFormConfig && baseDefaultValues && selectedDepartment ? (
                
                <Box>
                    
                    <InputGroup>
                        <InputLeftAddon w={'100px'}>
                        <Input type='text' placeholder='CC' w={'xs'} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}/>
                    </InputLeftAddon>
                        <Input w={'full'} type='tel' placeholder='5...' value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                    </InputGroup>
                    <br/>
                    <HStack>
                        <FormLabel >
                            <Text noOfLines={1} as="b">{'Müşteri'.toUpperCase()}:</Text>
                        </FormLabel>
                        <Input type='text' placeholder='Ad-Soyad' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </HStack>
                    <br/>
                    <AdvancedDynamicForm formConfig={updatedFormConfig} onSubmit={handleSubmit} onFormChange={handleFormChange} defaultValues={baseDefaultValues}/>
                    
                </Box>
                ) : (
                <Box>
                    <Text>Devam etmek için seçim yapınız.</Text>
                </Box>
                )}
                <br />
                <hr />
            </Box>
        </Box>
    );
}

export default EventForm;