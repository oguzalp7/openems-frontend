"use client"

import React from 'react'

import EventForm from '@/components/forms/event-form.component'
import ProtectedRoute from '@/components/protected-route.component'
const CreateEventPage = () => {
  return (
    <ProtectedRoute>
         <EventForm/>
    </ProtectedRoute>
   
  )
}

export default CreateEventPage