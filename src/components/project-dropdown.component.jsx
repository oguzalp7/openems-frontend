"use client"

import React, { useEffect, useState, useContext } from 'react';
import { Select, Spinner, IconButton, HStack } from '@chakra-ui/react';
import { apiClient } from '@/apiClient';
import AuthContext from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContaxt';
//import { GrPowerReset } from "react-icons/gr";

const ProjectDropdown = ({ onProjectSelect }) => {

    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const {user} = useContext(AuthContext)
    const { language, changeLanguage, availableLanguages } = useLanguage();

    useEffect(() => {
        fetchProjects(page);
    }, [page]);

    const fetchProjects = async (pageNum) => {
        if (loading || !hasMore) return;
        setLoading(true);
        
        const response = await apiClient.get(`/projects/${user.uid}?page=${pageNum}&size=50`);
        const data = response.data;
        setProjects(data.projects);
        
        setLoading(false);
    };

    
    

    // const handleLoadMore = async () => {
    //     if (hasMore) {
    //       setPage((prevPage) => prevPage + 1);  // Increment the page number
    //       const response = await fetchProjects(page + 1);  // Fetch next page
    //       setProjects((prev) => [...prev, ...response.projects]);  // Append new projects
    //     }
    //   };
    
    return (
        <HStack>
            <Select textAlign='center' placeholder={language == 'en' ? "Projects".toUpperCase() : "Projeler".toUpperCase()} onChange={(e) => onProjectSelect(e.target.value)}>
            {projects.map((project) => (
                <option key={project.id} value={project.id}>
                {project.name}
                </option>
            ))}
            
            {loading && <Spinner />}
            
            </Select>
            {/* <IconButton icon={<GrPowerReset />} onClick={handleReset}/> */}
            
        </HStack>
        
    );
};

export default ProjectDropdown;