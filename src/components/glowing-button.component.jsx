// RectangleButton.js
"use client";

import { Box, Button, keyframes } from "@chakra-ui/react";

const rotate = keyframes`
  0% {
    
    filter: rotate(0deg);
  }

  50% {
    
    filter: rotate(180deg);
  }

  100% {
    
    filter: rotate(360deg);
  }
`;


const GlowingButton = ({ children, handleClick }) => {
  return (
    <Box
      className="outer"
      position="relative"
      margin="0 50px"
      height="30px"
      width="full"
      borderRadius="50px"
      bg="linear-gradient( #5b0985, #390d4f, #230730)"
      _hover={{
        background:
            //"linear-gradient(#14ffe9, #ffeb3b, #ff00e0)",  
            "linear-gradient( #5b0985, #390d4f, #230730)",
            //"#390d4f",
        animation: `${rotate} 2s linear infinite`,
        "& span:nth-of-type(1)": { filter: "blur(7px)" },
        "& span:nth-of-type(2)": { filter: "blur(14px)" },
      }}
      rounded={'full'}
      onClick={handleClick}
    >
      <Button
        position="absolute"
        rounded={'full'}
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        height="30px"
        width="full"
        borderRadius="50px"
        bg="linear-gradient( #5b0985, #390d4f, #230730)"
        color="white"
        fontSize={["20px", "20px","20px", "20px"]}
        letterSpacing="1px"
        //textTransform="uppercase"
        zIndex={9}
        
      >
        {children}
      </Button>
      <Box
        as="span"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        height="100%"
        width="100%"
        bg="inherit"
        borderRadius="50px"
      />
      <Box
        as="span"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        height="100%"
        width="100%"
        bg="inherit"
        borderRadius="50px"
      />
    </Box>
  );
};

export default GlowingButton;
