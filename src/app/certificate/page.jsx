"use client"

import React from 'react'
import Certificate from '@/components/certificate.componnent';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
const CertificatePage = () => {
    const gender = 'Mrs.';
    const name = 'Yağmur Pelin Özsönmez';
    const text = `Has successfully completed the Make-up training given by Burcu Polen Yıldız on October 18-19, 2024 and was entitled to receive this certificate. `;
    const uuid = 'b78edf82-0ca5-40d2-9506-7d05a81a25af'
    //const text = `Has successfully completed the ${departmentMapping[selectedDepartment - 1]} training given by ${trainer} on ${monthMapping[new Date(selectedDate).getMonth() - 1]} ${new Date(selectedDate).getDate()} - ${new Date(selectedDate).getDate() + 1}, ${new Date(selectedDate).getFullYear()} and was entitled to receive this certificate. `;
    const title = `${gender}${name}`

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
       <Certificate title={title} text={text} uuid={uuid} onSave={handleSaveCertificate}/>
    )
}

export default CertificatePage