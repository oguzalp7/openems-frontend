import React, { useState, useContext } from 'react'
import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading
} from '@chakra-ui/react'
import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiUser,
    FiLogOut,
    FiPhoneOutgoing,
    FiCast,
    FiSettings,
    FiToggleRight
} from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContaxt'
import NavItem from './navbar-item.component'
import AuthContext from '@/context/AuthContext'
import { AiOutlineProject } from "react-icons/ai";
export default function Sidebar() {

    const [navSize, changeNavSize] = useState("small")
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const {user} = useContext(AuthContext);

    const roles_en = ["Basic", "Intermediate", "Advanced", "Project Partner", "LV-Staff"];
    const roles_tr = ["Basit", "Orta", "İleri", "Çözüm Ortağı", "LV-Yetkili"];
    const auth_index = user.auth_level - 1
    
    
    return (
        <Flex
            pos="sticky"
            left="5"
            h="95vh"
            marginTop="2.5vh"
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            borderRadius={navSize == "small" ? "15px" : "30px"}
            w={navSize == "small" ? "75px" : "200px"}
            flexDir="column"
            justifyContent="space-between"
        >
            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                as="nav"
            >
                <IconButton
                    background="none"
                    mt={5}
                    _hover={{ background: 'none' }}
                    icon={<FiMenu />}
                    onClick={() => {
                        if (navSize == "small")
                            changeNavSize("large")
                        else
                            changeNavSize("small")
                    }}
                />
                
                <NavItem navSize={navSize} icon={FiHome} title={language == 'en' ? 'Dashboard' : 'Pano'} to={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={AiOutlineProject} title={language == 'en' ? 'Projects' : 'Projeler'} to={'/dashboard/projects'}/>
                <NavItem navSize={navSize} icon={FiToggleRight} title={language == 'en' ? 'Outputs' : 'Çıktılar'} to={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiCast} title={language == 'en' ? 'Sensors' : 'Sensörler'}  to={'/dashboard/home'}/>

                <NavItem navSize={navSize} icon={FiCalendar} title={language == 'en' ? 'Automations' : 'Otomasyonlar'} to={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiUser} title={language == 'en' ? 'User' : 'Kullanıcı'} to={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiSettings} title={language == 'en' ? 'Settings' : 'Ayarlar'} to={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiPhoneOutgoing} title={language == 'en' ? 'Contact' : 'İletişim'} to={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiLogOut} title={language == 'en' ? 'Logout' : 'Çıkış'}  to={'/dashboard/logout'}/>
                {/* 
                <NavItem navSize={navSize} icon={IoPawOutline} title="Animals" />
                <NavItem navSize={navSize} icon={FiDollarSign} title="Stocks" />
                <NavItem navSize={navSize} icon={FiBriefcase} title="Reports" />
                <NavItem navSize={navSize} icon={FiLock} title="Settings" /> */}
            </Flex>

            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                mb={4}
            >
                <Divider display={navSize == "small" ? "none" : "flex"} />
                <Flex mt={4} align="center">
                    {/* <Avatar size="sm" src="avatar-1.jpg" /> */}
                    <Flex flexDir="column" ml={4} display={navSize == "small" ? "none" : "flex"}>
                        <Heading as="h3" size="sm">{user && user.name ? user.name : ""}</Heading>
                        <Text color="gray">{language == 'en' ? `${roles_en[auth_index]}` :  `${roles_tr[auth_index]}`}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}