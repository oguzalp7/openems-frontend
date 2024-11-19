"use client"

import React from "react";
import { Link, Box, Flex, Text, Button, Stack, Image, Heading, HStack, VStack, MenuList, Menu, useMediaQuery, MenuButton, MenuItem as ChakraMenuItem, Icon } from "@chakra-ui/react";
import LanguageDropdown from "./language-dropdown.component";
import { useLanguage } from "@/context/LanguageContaxt";
import { useState, useRef } from "react";
// import { ChevronDownIcon } from "@chakra-ui/icons";
import NextLink from 'next/link'

import {
  
  FiHome,
  FiLogOut,
  FiPhoneOutgoing,
  
} from 'react-icons/fi'


const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
        <Stack
            direction={'row'}
            spacing={5}
            
        >
           <Image 
            boxSize={['60px', '80px', '90px', '90px']}
            objectFit='cover' 
            src="https://lavittoria.ai/img/LV.png"
            onClick={() =>{
              console.log('image')
              window.location.href = '/'
            }}
            /> 
            <Stack display={['none', 'flex', 'flex']} direction={'column'} spacing={1}>
                <Heading
                 mt={4} 
                 color='gray.300' 
                 onClick={() =>{
                  console.log('heading')
                  window.location.href = '/'
                }}
                >
                  La Vittoria AI
                </Heading>
                <Text 
                  ml={0}
                  color={'green'}
                  onClick={() =>{
                    console.log('text')
                    window.location.href = '/'
                  }}
                >
                  /*Pulse Flow*/
                </Text>
            </Stack>
            
        </Stack>

        <MenuToggle toggle={toggle} isOpen={isOpen} />
        <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="white"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link as={NextLink} href={to}>
      <Text color={'gray.300'} noOfLines={1} display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};


const DropdownMenuItem = ({ children, options, to, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const handleMouseEnter = () => {
    if (isLargerThan768) {
      clearTimeout(timeoutRef.current);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isLargerThan768) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 300); // 3 seconds delay
    }
  };

  const handleClick = (e) => {
    if (!isLargerThan768) {
      // Prevent default link behavior if on smaller screens
      e.preventDefault();
      // Redirect to the catalog page
      window.location.href = to;
    }
  };

  return (
    <Box
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Link href={to}>
        <Text color={'gray.300'} noOfLines={1} display="block" {...rest}>
          {children}
        </Text>
      </Link>
      {isLargerThan768 && isHovered && (
        <Box position="absolute" top="100%" left="0" zIndex="dropdown" >
          <Menu isOpen >
            <MenuButton as={Box} />
            <MenuList>
              {options.map((option, index) => (
                <ChakraMenuItem key={index}>
                  <Link href={option.to}>
                    <Text color={'$rgba()'} noOfLines={1}>
                      {option.label}
                    </Text>
                  </Link>
                </ChakraMenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

const MenuLinks = ({ isOpen }) => {

  const { language, changeLanguage, availableLanguages } = useLanguage();

  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={4}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "column", "row", "row"]}
        pt={[0, 4, 0, 0]}
      >
        <MenuItem to="/dashboard/home">{language === 'en' ? (<HStack><Icon color={'gray.300'} boxSize={8} as={FiHome}/></HStack>) : (<HStack><Icon color={'gray.300'} boxSize={8} as={FiHome}/></HStack>) }</MenuItem>
        
        
        <MenuItem to="/dashboard/contact">{language === 'en' ? (<HStack><Icon color={'green'}  boxSize={8} as={FiPhoneOutgoing}/></HStack>) : (<HStack><Icon color={'green'} boxSize={8} as={FiPhoneOutgoing}/></HStack>) }</MenuItem>
        {/* <MenuItem> <a href="http://blog.lavittoria.ai">Blog</a></MenuItem> */}
        
        <MenuItem to="/dashboard/logout">{language === 'en' ? (<HStack><Icon color={'red.300'} boxSize={8} as={FiLogOut}/></HStack>) : (<HStack><Icon color={'red.300'} boxSize={8} as={FiLogOut}/></HStack>) }</MenuItem>
        <LanguageDropdown/>
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={["transparent", "transparent", "transparent", "transparent"]}
      color={["primary.700", "primary.700", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
