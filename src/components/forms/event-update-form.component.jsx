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
    return (
        <div><pre>{JSON.stringify(user, null, 2)}</pre></div>
    )
}

export default EventUpdateForm