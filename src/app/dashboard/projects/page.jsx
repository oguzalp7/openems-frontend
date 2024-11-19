"use client"

import React, { useState, useContext, useEffect } from 'react'
import ProtectedRoute from '@/components/protected-route.component';
import AuthContext from '@/context/AuthContext';

import DashboardLayout from '@/components/dashboard-layout';
import { useLanguage } from '@/context/LanguageContaxt';
import ProjectDropdown from '@/components/project-dropdown.component';

import OutputContainer from '@/components/output-container.component';
import ProjectInsertModal from '@/components/projects-insert-modal.component';
import { apiClient } from '@/apiClient';

import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import DataTable from '@/components/data-table.component';
import { removeKeysFromArrayOfObjects, renameColumn } from '@/utils/utils';

const Projects = () => {
    
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const {user} = useContext(AuthContext);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const keysToRemove = ['devices'];
    const keysToHide = ['id'];
    

    const fetchProjects = async (page) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/projects/${user.uid}?page=${page}&size=1`);

            let processedData = removeKeysFromArrayOfObjects(response.data.projects, keysToRemove)
            processedData = renameColumn(processedData, 'name', language === 'en' ? "Project" : "Proje");
            processedData = renameColumn(processedData, 'description', language === 'en' ? "Description" : "Açıklama");
            processedData = renameColumn(processedData, 'api_key', language === 'en' ? "Token" : "Proje Anahtarı");
            // Update outputs state with new data
            setProjects(processedData);
            setHasMore(response.data.total > response.data.page * response.data.size);
          } catch (error) {
              console.error('Error fetching outputs:', error);
          } finally {
            setLoading(false);
          }
    }

    // Initial fetch when component mounts or projectId changes
    useEffect(() => {
        setPage(1);
        setProjects([]);
        fetchProjects(1);
        //pairOutputs(outputs);
    }, [user, language]);

    

    const handlePaginationForward = () => {
        if (hasMore) {
          setPage((prev) => {
            const newPage = prev + 1;
            fetchProjects(newPage);
            return newPage;
          });
        }
    };
      
    const handlePaginationBackwards = () => {
        if (page > 1) {
            setPage((prev) => {
            const newPage = prev - 1;
            fetchProjects(newPage);
            return newPage;
            });
        }
    };


    // define buttons
    const customButtons = [
        {
            label: 'update',
            color: 'gray',
            onClick: handleUpdate,
            isDisabled: showDepartmentDropdown === false
        },
        {
            label: 'delete',
            color: 'red',
            onClick: handleDelete,
            isDisabled: showBranchDropdown === false
        },
    ];

    return (
        <ProtectedRoute>
            <DashboardLayout>
                {/* <ProjectDropdown onProjectSelect={setSelectedProject} /> */}
                <OutputContainer>
                    <ProjectInsertModal/>
                    {loading && (
                        <Skeleton w={'full'} h={'full'}>
                        
                        </Skeleton>
                    )}

                    {projects && (
                        <DataTable title={language == 'en' ? 'Projects' : 'Projeler'} obj={projects} showButtons={false}/>
                    )}

                </OutputContainer>
            </DashboardLayout>
        </ProtectedRoute>
    )
}

export default Projects