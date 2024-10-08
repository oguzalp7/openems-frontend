"use client"

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const AnalysisTable = ({ data, title }) => {

  const [tableData, setTableData] = useState([]);
  
  useEffect(() => {
    if(Array.isArray(data)){
      setTableData(data)
    }else{
      setTableData([])
    }
  },[data]);

  return (
    <Box width="100%" padding="20px">
      <Text as={'b'} fontSize="lg" mb="4">{title}</Text>
      <br/>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tableData.map((item, index) => (
          <li
            key={index}
            style={{
              padding: '5px',
              backgroundColor: index % 2 === 0 ? '#b3e5fc' : '#e1f5fe',
              borderBottom: '1px solid #ddd',
              color: 'black'
            }}
          >
            <strong>{item.label}:</strong> {item.data}
          </li>
        ))}
      </ul>
    </Box>
  );
}

export default AnalysisTable;