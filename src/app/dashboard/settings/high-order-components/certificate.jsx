"use client"

import React, {useState, useEffect, useContext, useRef} from 'react'
import AuthContext from '@/context/AuthContext'
import { apiClient } from '@/apiClient'
import Loading from '@/components/loading.component'

import { Box, VStack, Stack, Text, FormLabel, Input, HStack, Flex, Image, IconButton,  InputGroup, InputLeftAddon } from '@chakra-ui/react'

import DatePicker from '@/components/date-picker.component'
import ChakraDropdown from '@/components/dropdown.component'

import '@/styles/fonts.css';

import QRCode from 'qrcode';



import { GrNext, GrPrevious, GrPrint, GrCircleQuestion  } from "react-icons/gr";


import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { GiMagicBroom, GiBroom } from "react-icons/gi";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react'

import { Textarea, useToast } from '@chakra-ui/react'

const CertificateTab = () => {
    const {user} = useContext(AuthContext);

    const toast = useToast();

    if(user.auth_level < 5) {
        return (
            <Text>Bu içeriği görüntülemeye görüntüleyemezsiniz.</Text>
        );
    }

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    //const [dateAfterSelectedDate, setDateAfterSelectedDate] = useState(new Date(selectedDate) + 1);
    

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(12);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(1);

    const [fixedEmployee, setFixedEmployee] = useState({});
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(66);

    const [gender, setGender] = useState('Mrs.');
    const genders = [{id: 'Mr.', name: 'Mr.'}, {id: 'Mrs.', name: 'Mrs.'}];

    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('+90');
    const [contact, setContact] = useState('5');
    const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString().split('T')[0]);
    const [identificationNumber, setIdentificationNumber] = useState("");
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState("");

    const departmentMapping = ['Make-up Art', 'Hair Styling', 'Nail Art'];
    const monthMapping = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const [trainer, setTrainer] = useState('');


    const [uuid, setUuid] = useState(uuidv4());
    const [qrCode, setQrCode] = useState('');

    // const text = `Has successfully completed the ${departmentMapping[selectedDepartment - 1]} training given by ${trainer} on ${monthMapping[new Date(selectedDate).getMonth() - 1]} ${new Date(selectedDate).getDate()} - ${new Date(selectedDate).getDate() + 1}, ${new Date(selectedDate).getFullYear()} and was entitled to receive this certificate. `;
    // const title = `${gender}${name}`

    const [fontSize, setFontSize] = useState(50); // Default font size
    const maxCharacters = 26;

    useEffect(() => {
        // Adjust the font size based on the length of the text
        const textLength = `${gender}${name}`.length;
        
        // Simple formula: decrease font size if length exceeds limit
        if (textLength > maxCharacters) {
          const newFontSize = 50 - 2*(textLength - maxCharacters);
          setFontSize(Math.max(newFontSize, 30)); // Ensure font size doesn't go below 30
        } else {
          setFontSize(50); // Reset to default if below limit
        }
      }, [gender, name]);

    useEffect(() => {
        QRCode.toDataURL(`https://muberyasaglamstudios.com/certificate/${uuid}`).then((val) => (setQrCode(val)))
    }, [uuid]);
    
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await apiClient.get('/branch/?skip=0&limit=20');
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setBranches([]);
            }
        };
        fetchBranches();
    }, [user]);

    useEffect(() => {
        const fetchDepartmentsByBranch = async () => {
            try {
                const response = await apiClient.get(`/branch/offline/${selectedBranch}`);
                setDepartments(response.data.departments)
            } catch (error) {
                setDepartments([{id: -1, name: 'fetch error'}])
            }
        }
        fetchDepartmentsByBranch();
    }, [user, selectedBranch]);

    useEffect(() => {
        const fetchEmployeesByBranchAndDepartment = async () => {
            try {
                const response = await apiClient.get(`/employees/?b=${selectedBranch}&dep=${selectedDepartment}&active=true&skip=0&limit=100`);
                setEmployees(response.data)
            } catch (error) {
                setEmployees([{id: -1, name: 'fetch error'}])
            }
        }
        fetchEmployeesByBranchAndDepartment();
    }, [user, selectedBranch, selectedDepartment]);

    const handleSelectDate = (selectedDate) => {
        setSelectedDate(selectedDate);
    }

    const handleSelectBranch = (selectedBranch) => {
        setSelectedBranch(selectedBranch);
    }

    const handleSelectDepartment = (department) => {
        setSelectedDepartment(department);
    }

    const handleSelectGender = (selectedGender) => {
        setGender(selectedGender);
    }

    const handleSelectDateOfBirth = (selectedDate) => {
        setDateOfBirth(selectedDate)
    }

    const handleResetCustomerInfo = () => {
        setName("");
        setAddress("");
        setContact("");
        setCountryCode('+90');
        setIdentificationNumber("");
        setDateOfBirth(new Date().toISOString().split('T')[0]);
        setEmail("");
    }

    const handleSaveCertificate = async () => {
        const data = {
            uuid: uuid,
            title: `${gender}${name}`,
            text: `Has successfully completed the ${departmentMapping[selectedDepartment - 1]} training given by ${trainer} on ${monthMapping[new Date(selectedDate).getMonth() - 1]} ${new Date(selectedDate).getDate()} - ${new Date(selectedDate).getDate() + 1}, ${new Date(selectedDate).getFullYear()} and was entitled to receive this certificate.`,
            contact: contact,
            country_code: countryCode,
            identification_number: identificationNumber,
            date_of_birth: dateOfBirth,
            address: address
        }

        const createCertRecord = async () => {
            try {
                const response = await apiClient.post('/certificates/', data);
                toast({
                    title: 'Sertifika Veritabanına İşlendi.',
                    description: "İndirme işlemi başlatılıyor, lütfen indirme işlemi bitmeden sayfadan çıkmayınız.",
                    status: 'success',
                    isClosable: true,
                  })
            } catch (error) {
                console.error('Error creating certificate record:', error);
                toast({
                    title: 'Sertifika Oluşturulamadı.',
                    description: error.response.data.detail,
                    status: 'error',
                    isClosable: true,
                })
            }
        }

        createCertRecord();
        
        const certificateElement = document.getElementById('certificate');
        const canvas = await html2canvas(certificateElement, {scale: 2});
        const imageData = canvas.toDataURL('image/png');

        // Create a link to download the image
        // const link = document.createElement('a');
        // link.href = imageData;
        // link.download = `Certificate-${uuid}.png`; // Save with a new UUID filename
        // link.click();
        
        // Create PDF using jsPDF
        const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]); // Customize PDF size
        pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height); // Add the image to the PDF

        // Download the PDF
        pdf.save(`${uuid}.pdf`);

        setUuid(uuidv4())        
    }

    var selectedTestDate = new Date(selectedDate);
    //console.log(selectedTestDate)
    selectedTestDate.setDate(selectedTestDate.getDate() + 1);
    // console.log(selectedTestDate.toISOString().split('T')[0])

    
    return (
        <>
        <Box>
            <VStack>
            
                <Stack flexDir={['column', 'column', 'column', 'column']}>
                    <Text as={'h2'} textAlign={'center'}>EĞİTİM BİLGİLERİ</Text>
                    {user && branches ? (
                        <ChakraDropdown
                        options={branches}
                        label="ŞUBE"
                        initialValue={""}
                        value={selectedBranch}
                        onSelect={handleSelectBranch}
                        />
                    ) : (
                        <Loading />
                    )}
                    
                    {user && departments && selectedBranch ? (
                        <ChakraDropdown
                        options={departments}
                        label={'DEPARTMAN'}
                        value={selectedDepartment}
                        initialValue={""}
                        onSelect={handleSelectDepartment}
                    />

                    ): (<Loading/>)}

                    {/* {user && selectedDepartment && selectedBranch && employees ? (
                        <ChakraDropdown
                        options={employees}
                        label={'EĞİTMEN'}
                        value={selectedEmployee}
                        initialValue={""}
                        onSelect={handleSelectEmployee}
                    />

                    ): (<Loading/>)} */}

                    <Input type='text' value={trainer} onChange={(e) => {setTrainer(e.target.value)}} placeholder='Eğitmen ad-soyad' /> 

                    <DatePicker selectedDate={selectedDate} onSelect={handleSelectDate}/>


                    <Text as={'h2'} textAlign={'center'}>KATILIMCI BİLGİLERİ</Text>
                    <IconButton fontSize={'30px'} onClick={handleResetCustomerInfo}  aria-label={'Temizle'}>
                            {/* < GiBroom /> */}
                            <GiMagicBroom/>
                    </IconButton>
                    <ChakraDropdown options={genders} label={'CİNSİYET'} initialValue={''} value={gender} onSelect={handleSelectGender} />
                    
                    <Input type='text' value={name} onChange={(e) => {setName(e.target.value)}} placeholder='Katılımcı ad-soyad' />
                       
                    
                    <InputGroup>
                            <InputLeftAddon w={'100px'}>
                                <Input type='text' placeholder='CC' w={'xs'} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}/>
                            </InputLeftAddon>
                            <Input w={'full'} type='tel' placeholder='5...' value={contact} onChange={(e) => setContact(e.target.value)} />
                    </InputGroup>
                    <Input type='text' value={identificationNumber} onChange={(e) => {setIdentificationNumber(e.target.value)}} placeholder='TC Kimlik veya Pasaport No' />
                    <Input type='email' value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder='E-Mail' />
                    <Textarea type='text' value={address} onChange={(e) => {setAddress(e.target.value)}} placeholder='Katılımcı Adresi' />
                    
                    <HStack w={'full'}>
                        <Text>DOĞUM TARİHİ: </Text>
                        <DatePicker selectedDate={dateOfBirth} onSelect={handleSelectDateOfBirth}/>
                        <Popover>
                            <PopoverTrigger>
                                <IconButton variant={'ghost'} color={'teal'} textAlign={'center'} fontSize={'25px'} isRound={true}> 
                                    <GrCircleQuestion/>
                                </IconButton>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Katılımcı Doğum Tarihi</PopoverHeader>
                                <PopoverBody>Katılımcı doğum tarihi, ilerleyen dönemde analiz için kullanılacaktır.</PopoverBody>
                            </PopoverContent>
                            </Popover>
                    </HStack>
                       

                    {/* <Box>

                        <Slider
                            defaultValue={left}
                            value={left}
                            min={0}
                            max={100}
                            step={1}
                            onChange={(val) => setLeft(val)}
                            >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <HStack justifyContent={'center'}>
                            <IconButton w={'full'} onClick={handleDecreaseLeft}  aria-label={'Sola kaydır'}>
                                < GrPrevious />
                            </IconButton>
                            <IconButton w={'full'} onClick={handleIncreaseLeft}  aria-label={'Sağa kaydır'}>
                                < GrNext />
                            </IconButton>
                        </HStack>
                        
                    </Box> */}
                    <IconButton colorScheme={'blue'} w={'sm'} fontSize={'30px'}  onClick={handleSaveCertificate} aria-label='Sertifika oluştur'><GrPrint color='white'/></IconButton>

                </Stack>
                             
            </VStack>
            
        </Box>

     
        
        <Box id='certificate' position="relative" width="900px" height="600px"  margin="auto" mt={10} textAlign={'center'}>
            <Image src={'../cert-images/ms-cert-template.png'} alt="Certificate Template" boxSize="100%" objectFit="cover" />
            
            <Text fontFamily={'Corinthia'} position="absolute" top={`${40 + parseInt((50 - fontSize)/2)}%`} left={`50%`} transform="translateX(-52%)"  fontSize={`${fontSize}px`} fontWeight="medium" color="black">
                {`${gender}${name}`}
            </Text>

            <Text noOfLines={3} fontFamily={'Gideon'}  position="absolute" transform={'translateY(10%)'} top={`${60 + parseInt((50 - fontSize)/2)}%`} left={'10%'} right={'10%'} fontSize="18px" fontWeight="bold" color="gray" paddingBottom={'5px'}>
                {`Has successfully completed the ${departmentMapping[selectedDepartment - 1]} activity given by ${trainer} on ${monthMapping[new Date(selectedDate).getMonth()]} ${new Date(selectedDate).getDate()} - ${monthMapping[new Date(selectedTestDate.toISOString().split('T')[0]).getMonth()]} ${new Date(selectedTestDate.toISOString().split('T')[0]).getDate()}, ${new Date(selectedDate).getFullYear()} and was entitled to receive this certificate.`}
            </Text>

            <Image src={qrCode} alt="Scan To View The Certificate"  position={'absolute'} left={'10%'} bottom={'13%'} width={'70px'} height={'70px'}/>
            
            <HStack>
                <Text  position="absolute" top="88%"  left='5%' transform={'translateY(-10%)'} color={'gray.200'}>
                   Sertifika No: {uuid}
                </Text>
            </HStack>
        </Box>     
        </>
       
    )
}

export default CertificateTab

