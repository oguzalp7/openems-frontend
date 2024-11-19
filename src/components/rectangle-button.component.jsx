// RectangleButton.js
"use client";

import { Box, Button, keyframes } from "@chakra-ui/react";

const rotate = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
`;

const RectangleButton = ({ children, isOn }) => {
  return (
    <Box
      className="outer"
      position="relative"
      margin="0 50px"
      height="70px"
      width="220px"
      borderRadius="50px"
      bg="#111"
      // _hover={{
      //   background:
      //     "linear-gradient(#14ffe9, #ffeb3b, #ff00e0)",
      //   animation: `${rotate} 1.5s linear infinite`,
      //   "& span:nth-of-type(1)": { filter: "blur(7px)" },
      //   "& span:nth-of-type(2)": { filter: "blur(14px)" },
      // }}
      boxShadow={isOn ? '0 0 30px rgba(0, 255, 0, 0.5)' : '0 0 30px rgba(255, 0, 0, 0.5)'}
    >
      <Button
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        height="60px"
        width="210px"
        borderRadius="50px"
        bg={isOn ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'}
        color="#f2f2f2"
        fontSize="20px"
        letterSpacing="1px"
        textTransform="uppercase"
        boxShadow={isOn ? '0 0 10px rgba(0, 255, 0, 0.5)' : '0 0 10px rgba(255, 0, 0, 0.5)'}
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

export default RectangleButton;
