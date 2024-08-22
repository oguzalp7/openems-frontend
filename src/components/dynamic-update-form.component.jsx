"use client"
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '@/context/AuthContext'
import { apiClient } from '@/apiClient'
import { generateFormConfig} from '@/utils';
import * as yup from 'yup';
import AdvancedDynamicForm from './advanced-dynamic-form.component';



const DynamicUpdateForm = ({ schemaUrl, onSubmit, defaultValues, recordId }) => {

    const {user} = useContext(AuthContext)
    const [schema, setSchema] = useState(null);
    const [formConfig, setFormConfig] = useState([]);
    const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormSchema = async () => {
            try {
              const response = await apiClient.get(schemaUrl);
              setSchema(response.data);
              setLoading(false);
            } catch (error) {
              console.error('Error fetching schema:', error);
              setLoading(false);
            }
        };
        fetchFormSchema();  
    }, [user]);

    useEffect(() => {
        if(schema){
            const config = generateFormConfig(schema);
            setFormConfig(config);

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

    const handleFormChange = (values) => {

    }
  
    return (
        <AdvancedDynamicForm formConfig={formConfig} onSubmit={onSubmit} defaultValues={defaultValues} onFormChange={handleFormChange}/>
  )
}

export default DynamicUpdateForm