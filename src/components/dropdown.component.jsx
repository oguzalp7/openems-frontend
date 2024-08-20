"use client"

import { Box, Select, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'

const ChakraDropdown = ({options, label, initialValue, value, onSelect}) => {

  const [selectedValue, setSelectedValue] = React.useState(value || initialValue);

  useEffect(() => {
      setSelectedValue(value || initialValue);
  }, [value, initialValue]);

  const handleChange = (e) => {
      const selectedId = e.target.value;
      //console.log(selectedId)
      onSelect(selectedId);
  }

  return (
    <Box>
        <Select value={selectedValue} onChange={handleChange}>
        <option key={-1} value={initialValue} label={`${label}`}><Text>{`${label}`}</Text></option>
        {options && options.map((option) => (
            <option key={option.id} value={option.id || option.ID} label={option["AD-SOYAD"] || option.name} >{option["AD-SOYAD"]  || option.name}</option>
        ))}
        </Select>
    </Box>
  )
}

export default ChakraDropdown

