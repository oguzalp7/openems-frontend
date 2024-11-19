"use client"

import React, {useEffect, useState, useContext} from 'react'
import { SimpleGrid, Spinner, Box, Button, Stack, IconButton} from '@chakra-ui/react'
import { GrNext, GrPrevious  } from "react-icons/gr";



import OutputContentCard from './output-content-card.component'
import AuthContext from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContaxt'
import { apiClient } from '@/apiClient'

import SealedOutputCard from './sealed-output-card.component'

const OutputContentGrid = ({projectId}) => {

    const {user} = useContext(AuthContext)
    const { language, changeLanguage, availableLanguages } = useLanguage();

    const [outputs, setOutputs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [pairedOutputs, setPairedOutputs] = useState([]);
    const [unsealedOutputs, setUnsealedOutputs] = useState([]);


    const fetchOutputs = async (page) => {
        setLoading(true);
        // Fetch outputs from the API
        try {
          const response = await apiClient.get(`/outputs/project/${projectId}?page=${page}&size=20`);
          const data = await response.data;
          
          // Update outputs state with new data
          setOutputs(data.outputs);
          setHasMore(data.total > data.page * data.size);
        } catch (error) {
            console.error('Error fetching outputs:', error);
        } finally {
          setLoading(false);
        }
    };

    // Pair outputs by related_gpio if sealed
    const pairOutputs = (outputs) => {
        const paired = [];
        const unsealed = [];
        const seen = new Set();

        outputs.forEach((output) => {
        if (output.sealed && output.related_gpio && output.pcf8574_address && !seen.has(output.id)) {
            const relatedOutput = outputs.find((o) => (o.gpio === output.related_gpio && o.pcf8574_address === output.pcf8574_address));
            console.log(relatedOutput)
            if (relatedOutput) {
                paired.push([output, relatedOutput]);
            seen.add(output.id);
            seen.add(relatedOutput.id);
            }
        } else if (!output.sealed) {
            unsealed.push(output);
        }
        });
        
        
        return {paired, unsealed };
    };

    // Initial fetch when component mounts or projectId changes
    useEffect(() => {
        setPage(1);
        setOutputs([]);
        fetchOutputs(1);
        //pairOutputs(outputs);
    }, [projectId]);

    

    useEffect(() => {
        const { paired, unsealed } = pairOutputs(outputs);
        setPairedOutputs(paired);
        setUnsealedOutputs(unsealed);
    }, [outputs]);
    
    const handlePaginationForward = () => {
        if (hasMore) {
          setPage((prev) => {
            const newPage = prev + 1;
            fetchOutputs(newPage);
            return newPage;
          });
        }
    };
      
    const handlePaginationBackwards = () => {
        if (page > 1) {
            setPage((prev) => {
            const newPage = prev - 1;
            fetchOutputs(newPage);
            return newPage;
            });
        }
    };

    console.log(outputs)
    
    return (
        <Box height="80vh" overflowY="auto">
            {outputs && (
                <SimpleGrid columns={[1, 1, 1, 3]} spacing={4}>
                    {pairedOutputs && pairedOutputs.map((outputs, index) => (
                        <SealedOutputCard key={index} outputs={outputs} />
                    ))}
                    {unsealedOutputs && unsealedOutputs.map((output, index) => (
                        <OutputContentCard key={index} output={output} />
                    ))}
                    {loading && <Spinner />}
            </SimpleGrid>
            )}
            <Stack justifyContent={'center'} flexDir={["row"]}>
            {page > 1 && (
                <IconButton onClick={handlePaginationBackwards}  aria-label={language == 'en' ? "Previous" : "Geri"}>
                    < GrPrevious />
                </IconButton>
                
            )}
            {hasMore && (
                
                <IconButton onClick={handlePaginationForward}  aria-label={language == 'en' ? "Next" : "İleri"}>
                    < GrNext />
                </IconButton>
            )}
            </Stack>
            
        </Box>
    )
}

export default OutputContentGrid

