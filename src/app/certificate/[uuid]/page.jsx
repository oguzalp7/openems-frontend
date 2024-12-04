"use client"

import React, {useState, useEffect} from 'react'
import Certificate from '@/components/certificate.componnent';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { apiClient } from '@/apiClient';
import Loading from '@/components/loading.component';
import { useToast } from '@chakra-ui/react';

import QRCode from 'qrcode';

import { Button, Text, Heading, Box, Image, Stack, Checkbox } from '@chakra-ui/react';
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'


const CertificatePage = ({params}) => {

    const [checkBoxSelected, setCheckboxSelected] = useState(false);
    const [consentAccepted, setConsentAccepted] = useState(false);
    
    const uuid = params.uuid;
    const toast = useToast();
    const [certData, setCertData] = useState(null)
    const [loading, setLoading] = useState(false);

    const headers = {accept: 'application/json'}
    const [qrCode, setQrCode] = useState('');

    

    useEffect(() => {
      QRCode.toDataURL(`https://muberyasaglamstudios.com/certificate/${uuid}`).then((val) => (setQrCode(val)))
    }, [uuid]);
    

    useEffect(() => {
      const fetchCertData = async () => {
       
        try {
          const response = await apiClient.get(`/certificates/${uuid}`, headers);
          setCertData(response.data)
        } catch (error) {
          toast({
            title: 'Sertifika Bulunamadı.',
            description: error.response.data.detail,
            status: 'error',
            
            isClosable: true,
          })
        } finally{
          setLoading(false);
        }
      }
      fetchCertData();
    }, []);

    
    
    const handleSaveCertificate = async () => {
        const certificateElement = document.getElementById('certificate');
        const canvas = await html2canvas(certificateElement);
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
    }
    // return (
    //  <>
    //   { certData && !loading ? (
    //       <Certificate title={certData.title} text={certData.text} qrCode={qrCode} uuid={uuid} onSave={handleSaveCertificate}/>
    //     ):(
    //       <Loading/>
    //     )}
        
    //  </>
    // )

    const handleAcceptConsent = () => {

      if(checkBoxSelected){
        setConsentAccepted(true)
     
        toast({
          title: 'Bilgilendirme şartları ve koşulları kabul edildi.',
          description: "Katılım belgenizin dijital kopyasını yazıcı ikonlu butona tıklayarak indirebilirsiniz.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }else{
        toast({
          title: 'Bilgilendirme şartları ve koşulları kabul etmeniz gerekli.',
          // description: "Okudum ve kabul ediyorum.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
      
    }

    return(
      <Box>
          {consentAccepted ? (
             <>
            { certData && !loading ? (
                <Certificate title={certData.title} text={certData.text} qrCode={qrCode} uuid={uuid} onSave={handleSaveCertificate}/>
              ):(
                <Loading/>
              )}
              
          </>
          ):(
            <Box>
              <Heading textAlign={'center'} as={'h1'} size={['md', 'lg','xl', '2xl']}>BİLGİLENDİRME</Heading>
              <br/>
              <Text textAlign={'center'}>Müberya Sağlam tarafından düzenlenen Makyaj Teknikleri Etkinlikleri'ne göstermiş olduğunuz ilgiden dolayı hepinize çok teşekkür ederiz.</Text>
              <br/>
              <Stack align={'center'}>
                <Image
                    src="../logo.png"
                    alt="Logo"
                    borderRadius='full'
                    boxSize={['100px', '150px', '200px', '250px']}
                    
                />
              </Stack>
              <br/>
              <Text textAlign={'center'}>Katılım belgenizin dijital kopyası hazır. Belgenizi görüntülemek veya indirmek için, lütfen "Okudum ve şartları kabul ediyorum." maddesini işaretleyerek devam ediniz. </Text>
              
              <br/>
              <Box>
                <OrderedList textAlign={['center', 'center', 'start', 'start']}>
                  <ListItem>Katılmış olduğunuz etkinlik sonucunda; adınıza düzenlenen bu Katılım Belgesi iş yeri açma belgesi olarak kullanılamaz.Bu hususta Müberya Sağlam tarafından her hangi bir taahhüt verilmez.</ListItem>
                  <br/>
                  <ListItem>Tarafımızca verilen Katılım Belgesi, kişisel verileriniz Müberya Sağlam Profesyonel Makyaj Stüdyoları ve yazılımsal çözüm ortağı <a href='https://lavittoria.ai'>La Vittoria Bilgi Sistemleri</a> tarafından saklanır ve güvenle korunur.</ListItem>
                  <br/>
                  <ListItem>Müberya Sağlam Profesyonel Makyaj Stüdyoları'nın herhangi bir kurum, kuruluş veya herhangi bir ülke ile anlaşması bulunmamaktadır. Almış olduğunuz Katılım Belgesi sadece ve sadece Müberya Sağlam Profesyonel Makyaj Stüdyoları için onaylıdır.  </ListItem>
                  <br/>
                  <ListItem>Katılmış olduğunuz etkinlik doğrultusunda vermiş olduğunuz bilgiler 6698 sayılı "Kişisel Verilerin Korunması Kanunu" kapsamında korunmaktadır.  </ListItem>
                  <br/>
                </OrderedList>
              </Box>
              <br/>
              <Stack align={'center'}>
                <Checkbox
                  isChecked={checkBoxSelected}
                  onChange={() => setCheckboxSelected(!checkBoxSelected)}
                  // colorScheme='orange'
                  
                >
                  Okudum ve şartları kabul ediyorum.
                </Checkbox>
                
                <Button onClick={handleAcceptConsent}>Devam Et</Button>
                <br/>
              </Stack>
            </Box>
          )}
      </Box>
    );
}

export default CertificatePage