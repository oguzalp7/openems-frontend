"use client"

import { Box, Flex } from '@chakra-ui/react';


const Layout = ({ children }) => {
  return (
    <Flex  direction="column" maxHeight="200vh">
      
      {/* Content Section */}
      <Flex as="main" flex="1" justify="center" align="center" p={4} w={['md-2px', 'full']}>
        {/* <Box width="100%" maxWidth="full"> */}
          {children}
        {/* </Box> */}
      </Flex>
      
      
    </Flex>
  );
};

export default Layout;