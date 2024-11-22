"use client"

import React, {useState, useEffect} from 'react'
import Certificate from '@/components/certificate.componnent';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { apiClient } from '@/apiClient';
import Loading from '@/components/loading.component';
import { useToast } from '@chakra-ui/react';

import QRCode from 'qrcode';

const CertificatePage = ({params}) => {
    
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

    console.log(certData)
    
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
    return (
     <>
      { certData && !loading ? (
          <Certificate title={certData.title} text={certData.text} qrCode={qrCode} uuid={uuid} onSave={handleSaveCertificate}/>
        ):(
          <Loading/>
        )}
        
     </>
    )
}

export default CertificatePage