import { Box, Grid, Text, Spinner, useToast, SimpleGrid } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/apiClient';


import React from 'react'

const Calendar = ({ fetchURL }) => {

    const [eventsData, setEventsData] = useState({});
    const [loading, setLoading] = useState(true);
    
    const toast = useToast();

    const [numDays, setNumDays] = useState(30); // Default to 30 days
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // Extract month and year from fetchURL and calculate number of days in the month
    useEffect(() => {
        const urlParams = new URLSearchParams(fetchURL.split('?')[1]);
        const month = urlParams.get('month');
        const year = urlParams.get('year');

        setSelectedMonth(month);
        setSelectedYear(year);

        // Calculate number of days in the selected month and year
        const daysInMonth = new Date(year, month, 0).getDate(); // Automatically calculates days in month
        setNumDays(daysInMonth);
    }, [fetchURL]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            // Fetch data from the backend, replace the URL with your actual endpoint
            const response = await apiClient.get(fetchURL);
            setEventsData(response.data);
          } catch (error) {
            toast({
              title: "Randevular getirilemedi.",
              description: error.response?.data?.message || error.message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
    }, [fetchURL]);

    const getDayColor = (day) => {
        const intensity = eventsData[day];
        // if (!intensity) return isLightTheme ? 'white' : 'black'; // No event, default color
        
        // Calculate alpha value based on intensity, maxing out at 10
        const alpha = Math.min(intensity / 10, 1); 
        return `rgba(255, 0, 0, ${alpha})`; // Blue color with varying intensity
    };
    
    
    return (
        <SimpleGrid columns={7} spacing={2} w="100%">
        {Array.from({ length: numDays }, (_, index) => {
            const day = index + 1; // Days start from 1 to numDays
            return (
            <Box
                key={day}
                w="40px"
                h="40px"
                bg={getDayColor(day)}
                borderRadius="md"
                display="flex"
                justifyContent="center"
                alignItems="center"
                border={"1px"}
            >
                {day}
            </Box>
            );
        })}
        </SimpleGrid>
    )
}

export default Calendar