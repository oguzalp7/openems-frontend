"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { apiClient } from '@/apiClient';
import * as yup from 'yup';
import { generateFormConfig, alterFormConfigType, findFieldIndex, renameFormLabels, updateFieldOptions, fieldExistsInFormConfig, reorderFormConfig, flattenDefaultValues, formatTime } from '@/utils';
import AdvancedDynamicForm from '../advanced-dynamic-form.component';
import AuthContext from '@/context/AuthContext';


const EventUpdateForm = ({ onSubmit, defaultValues, eventId }) => {
    const {user} = useContext(AuthContext);

    const [baseSchema, setBaseSchema] = useState(null);
    const [baseFormConfig, setBaseFormConfig] = useState([]);
    const [detailsSchema, setDetailsSchema] = useState(null);
    const [detailsFormConfig, setDetailsFormConfig] = useState([]);
    const [combinedFormConfig, setCombinedFormConfig] = useState([]);
    const [combinedValidationSchema, setCombinedValidationSchema] = useState(yup.object().shape({}));
    const { register, handleSubmit, control, reset } = useForm({
      defaultValues: defaultValues,
    });
    const formValues = useWatch({ control });

    const [processes, setProcesses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesHair, setEmployeesHair] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [fixedEmployee, setFixedEmployee] = useState({});

    useEffect(() => {
        const fetchFixedEmployee = async () => {
            try {
                const response = await apiClient.get(`/employees/?b=12&dep=1&active=true&skip=0&limit=10`);
                setFixedEmployee(response.data[0])
            } catch (error) {
                setFixedEmployee({})
            }
        }
        fetchFixedEmployee();
    }, []);

    // Fetch schemas by event_id
    useEffect(() => {
        const fetchSchema = async () => {
        try {
            const response = await apiClient.get(`/event/schema/event/${eventId}`);
            const { base_schema, details_schema } = response.data;

            setBaseSchema(base_schema);
            setDetailsSchema(details_schema);
        } catch (err) {
            console.error(err);
        }
        };
        fetchSchema();
    }, [eventId]);


     // Generate form configurations
     useEffect(() => {
        if (baseSchema) {
        const config = generateFormConfig(baseSchema);
        setBaseFormConfig(config);

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
        setCombinedValidationSchema(yupSchema);
        }
    }, [baseSchema]);

    useEffect(() => {
        if (detailsSchema) {
        const config = generateFormConfig(detailsSchema);
        setDetailsFormConfig(config);

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
        setCombinedValidationSchema(prevSchema => prevSchema.concat(yupSchema));
        }
    }, [detailsSchema]);

    // Combine base and details form configurations
    useEffect(() => {
        const combinedConfig = [...baseFormConfig, ...detailsFormConfig];
        setCombinedFormConfig(combinedConfig);
    }, [baseFormConfig, detailsFormConfig]);

    useEffect(() => {
        if (defaultValues && defaultValues.details) {
          const flatDetails = { ...defaultValues, ...defaultValues.details };
          delete flatDetails.details;
          reset(flatDetails);
        } else {
          reset(defaultValues);
        }
    }, [defaultValues, reset]);
    

    // fetch department
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await apiClient.get(`/processes/dep/${defaultValues.process_id}`);
                setSelectedDepartment(response.data)
            } catch (error) {
                setSelectedDepartment('');
            }
        }
        fetchDepartment();
    }, [defaultValues, combinedFormConfig, fieldExistsInFormConfig(combinedFormConfig, 'process_id')]);
    let updatedFormConfig = [...combinedFormConfig];
    const selectedBranch = defaultValues.branch_id;
    //defaultValues.details = '{}';
    // fetch dropdown data

    // fetch processes
    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await apiClient.get(`/processes/?dep=${selectedDepartment}&skip=0&limit=150`);
                setProcesses(response.data)
            } catch (error) {
                console.log(error)
                setProcesses([]);
            }
            
        }
        //if(fieldExistsInFormConfig(updatedFormConfig, 'process_id')){
            fetchProcesses();
        //}
    }, [user, defaultValues, eventId, selectedDepartment]);

    
    
    // fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=${selectedDepartment}&active=true&skip=0&limit=100`);
                setEmployees(response.data)
            } catch (error) {
                setEmployees([]);
            }
            
            //updatedFormConfig = updateFieldOptions(updatedFormConfig, 'process_id', response.data);
        }
        //if(fieldExistsInFormConfig(updatedFormConfig, 'employee_id')){
            fetchEmployees();
        //}
    }, [user, selectedBranch, selectedDepartment]);
    
    useEffect(() => {
        if(selectedDepartment === '1' || selectedDepartment === 1){
            employees.push(fixedEmployee)
        }
    }, [selectedDepartment, fixedEmployee, employees]);

    useEffect(() => {
        const fetchHairStylists = async () => {
            try {
                const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=2&active=true&skip=0&limit=100`);
                setEmployeesHair(response.data);
            } catch (error) {
                setEmployeesHair([])
            }
        }

        const fetchPaymentTypes = async () => {
            try {
                const response = await apiClient.get('/payment-types/?skip=0&limit=100');
                setPaymentTypes(response.data);
            } catch (error) {
                setPaymentTypes([])
            }
        }

        if(selectedDepartment === 1){
            fetchHairStylists();
            fetchPaymentTypes();
        }
    }, [user, selectedDepartment]);

    if(fieldExistsInFormConfig(updatedFormConfig, 'process_id') && processes){
        const processDropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'process_id');
        if(updatedFormConfig && updatedFormConfig[processDropdownIndex] && updatedFormConfig[processDropdownIndex].options){
            if(typeof(updatedFormConfig[processDropdownIndex].options) === typeof(processes)){
                updatedFormConfig[processDropdownIndex].options = processes;
            }
        }
    }

    if(fieldExistsInFormConfig(updatedFormConfig, 'employee_id') && employees){
        const DropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'employee_id');
        if(updatedFormConfig && updatedFormConfig[DropdownIndex] && updatedFormConfig[DropdownIndex].options){
            if(typeof(updatedFormConfig[DropdownIndex].options) === typeof(employees)){
                updatedFormConfig[DropdownIndex].options = employees;
            }
        }
    }
    
    
    if(selectedDepartment === 1 ){
        if(fieldExistsInFormConfig(updatedFormConfig, 'optional_makeup_id') && employees){
            const DropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'optional_makeup_id');
            if(updatedFormConfig && updatedFormConfig[DropdownIndex] && updatedFormConfig[DropdownIndex].options){
                if(typeof(updatedFormConfig[DropdownIndex].options) === typeof(employees)){
                    updatedFormConfig[DropdownIndex].options = employees;
                }
            }
        }
        if(fieldExistsInFormConfig(updatedFormConfig, 'hair_stylist_id') && employeesHair){
            const DropdownIndex = findFieldIndex(updatedFormConfig, 'select', 'hair_stylist_id');
            if(updatedFormConfig && updatedFormConfig[DropdownIndex] && updatedFormConfig[DropdownIndex].options){
                if(typeof(updatedFormConfig[DropdownIndex].options) === typeof(employeesHair)){
                    updatedFormConfig[DropdownIndex].options = employeesHair;
                }
            }
        }

        const paymentTypeDropdownIndex = findFieldIndex(updatedFormConfig, 'select', "payment_type_id");
        if(updatedFormConfig && updatedFormConfig[paymentTypeDropdownIndex] && updatedFormConfig[paymentTypeDropdownIndex].options){
          if(typeof(updatedFormConfig[paymentTypeDropdownIndex].options) === typeof(paymentTypes)){
              updatedFormConfig[paymentTypeDropdownIndex].options = paymentTypes;
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
    
    defaultValues = flattenDefaultValues(defaultValues);
    defaultValues.time = formatTime(defaultValues.time)

    const handleFormSubmit = (data) => {
        // Extract details fields and put them into a nested details object
        const detailsFields = detailsFormConfig.map(field => field.name);
        const details = {};
        const mainData = { ...data };
    
        detailsFields.forEach(field => {
          if (data[field] !== undefined) {
            details[field] = data[field];
            delete mainData[field];
          }
        });
    
        mainData.details = details;
    
        onSubmit(mainData);
    };
    const handleFormChange = (values) => {
        //console.log(values)
    }
    return (
        <AdvancedDynamicForm formConfig={updatedFormConfig} defaultValues={defaultValues} onSubmit={handleFormSubmit} onFormChange={handleFormChange}/>
    )
}

export default EventUpdateForm