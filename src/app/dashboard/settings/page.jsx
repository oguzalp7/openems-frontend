"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import ProtectedRoute from '@/components/protected-route.component';

import Branch from './high-order-components/branch';
import Employees from './high-order-components/employee';
import ChangePasswordForm from '@/components/change-password-form.component';
import UserEmployee from '@/components/forms/user-employee-form.component';
import ProcessPrice from './high-order-components/process-price';

import EventStatements from './high-order-components/event-statements';

const OtherTabContent = () => {
    return(
        <Box >
            <EventStatements/>
        </Box>
    );
}

const Settings = () => {

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (index) => {
        setSelectedTab(index);
    };

    return (
        <ProtectedRoute>
            <Tabs w={['sm', 'md', 'lg', '2xl']} index={selectedTab} onChange={handleTabChange} isFitted>
            
            <TabList overflowX="auto" whiteSpace="nowrap">
                <Tab flexShrink={0}>YÖNETİM</Tab>
                <Tab flexShrink={0}>FİYATLAR</Tab>
                <Tab flexShrink={0}>PERSONEL EKLE</Tab>
                <Tab flexShrink={0}>ŞİFRE DEĞİŞTİR</Tab>
                <Tab flexShrink={0}>ŞUBELER</Tab>
                <Tab flexShrink={0}>MUHASEBE</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    {selectedTab === 0 && <Employees/>}
                </TabPanel>
                <TabPanel>
                    {selectedTab === 1 && <ProcessPrice/>}
                </TabPanel>
                <TabPanel>
                    {selectedTab === 2 && <UserEmployee/>}
                </TabPanel>
                <TabPanel>
                    {selectedTab === 3 && <ChangePasswordForm/>}
                </TabPanel>
                <TabPanel>
                    {selectedTab === 4 && <Branch/>}
                </TabPanel>
                <TabPanel>
                    {selectedTab === 5 && <EventStatements/>}
                </TabPanel>
            </TabPanels>
        </Tabs>
        </ProtectedRoute>
        
    )
}

export default Settings