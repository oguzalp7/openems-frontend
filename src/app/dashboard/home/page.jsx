"use client"

import React from 'react'
import ProtectedRoute from '@/components/protected-route.component';

import DashboardLayout from '@/components/dashboard-layout';
import SensorContainer from '@/components/sensor-container.component';
import OutputContainer from '@/components/output-container.component';
import OutputContentGrid from '@/components/output-content-grid.component';
import SensorNotFoundCard from '@/components/sensor-not-found.card.component';
import ProjectDropdown from '@/components/project-dropdown.component';
import { Stack, Text, HStack, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContaxt';


import useSealedButtonsToggle from '@/hooks/useToggleSealedButtons';


const Home = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const { isStartOn, isStopOn, toggleSealedButtons } = useSealedButtonsToggle();
  return (
    <ProtectedRoute>
        <DashboardLayout>
            <ProjectDropdown onProjectSelect={setSelectedProject} />
            
            {/* <SensorContainer>
              <SensorNotFoundCard/>
            </SensorContainer> */}

            {/* <Stack align={'center'} border={'1px'}>
              <Text>Select Project Component</Text>
            </Stack> */}
            <OutputContainer>
              
              {selectedProject ? (
                <OutputContentGrid projectId={selectedProject}/>
                ) : (
                  <Text>{language == 'en' ? "Please select a project from the menu, in order to continue." : "Devam etmek için, lütfen menüden proje seçiniz. "}</Text>
                )}
              
                {/* <OutputCard/> */}
               
            </OutputContainer>
            
      
        </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Home;