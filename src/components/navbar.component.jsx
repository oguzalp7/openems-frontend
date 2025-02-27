"use client"

import Link from "next/link"

import React from "react"
import { Flex, IconButton, Image, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Navbar =  () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return(
        <Flex w={['20rem', 'xs', 'lg', 'lg']} ml={[0, 0, 10, 20]}>
            <Flex  align='center'>
                <Flex display={['flex', 'flex', 'flex', 'flex']}>
                    <Link href={'/dashboard/create-event'}>
                        <Image src="./assets/ekleme.png" alt="event"/>
                    </Link>

                    <Link href={'/dashboard/events'}>
                        <Image src="./assets/saat.png" alt="events"/>
                    </Link>

                    <Link href={'/dashboard/ms'}>
                        <Image src="./assets/ms.png" alt="settings"/>
                    </Link>

                    <Link href={'/dashboard/analysis'}>
                        <Image src="./assets/grafik.png" alt="analysis"/>
                    </Link>

                    <Link href={'/dashboard/customers'}>
                        <Image src="./assets/mercek.png" alt="customers"/>
                    </Link>

                    <Link href={'/dashboard/settings'}>
                        <Image src="./assets/ayarlar.png" alt="settings"/>
                    </Link>

                    <Link href={'/dashboard/logout'}>
                        <Image src="./assets/kapat.png" alt="logout"/>
                    </Link>
                </Flex>
            </Flex>
            <IconButton
                background={colorMode === 'light' ? 'white' : 'transparent'}
                size='xl'
                aria-label="Toggle color mode"
                w={10}
                onClick={toggleColorMode}
                icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                border={'1px'}
                //borderColor={"transparent"}
                borderColor={"gray.700"}
            />
        </Flex>
        
    );
}

export default Navbar