import * as XLSX from 'xlsx';

const exportExcel = (data, overallTotal) => {
  const worksheetData = [];
  const headers = ["TARİH"];
  const paymentTypesSet = new Set();

  // Create the header row
  data.forEach(([_, categories]) => {
    Object.keys(categories).forEach(category => {
      Object.keys(categories[category]).forEach(paymentType => {
        paymentTypesSet.add(paymentType);  // Collect all unique payment types
      });
    });
  });

  const paymentTypes = Array.from(paymentTypesSet);
  
  const categoryHeaders = [];
  data.forEach(([_, categories]) => {
    Object.keys(categories).forEach(category => {
      if (!categoryHeaders.includes(category)) {
        categoryHeaders.push(category);
        headers.push(`${category} - NAKİT`);
        headers.push(`${category} - VISA`);
      }
    });
  });
  
  headers.push("TOPLAM - NAKİT");
  headers.push("TOPLAM - VISA");
  headers.push("GENEL TOPLAM");
  worksheetData.push(headers);

  // Add data rows
  data.forEach(([date, categories]) => {
    const row = [date];
    categoryHeaders.forEach(category => {
      const nakit = categories[category]?.NAKİT || 0;
      const visa = categories[category]?.VISA || 0;
      row.push(nakit);
      row.push(visa);
    });
    row.push(categories.TOPLAM?.NAKİT || 0);
    row.push(categories.TOPLAM?.VISA || 0);
    row.push(categories.TOPLAM?.NAKİT + categories.TOPLAM?.VISA || 0);
    worksheetData.push(row);
  });

  // Add overall total row
  const overallTotalRow = ["GENEL TOPLAM"];
  categoryHeaders.forEach(() => {
    overallTotalRow.push("");
    overallTotalRow.push("");
  });
  overallTotalRow.push(overallTotal.NAKİT || 0);
  overallTotalRow.push(overallTotal.VISA || 0);
  overallTotalRow.push(overallTotal.GENEL_TOPLAM || 0);
  worksheetData.push(overallTotalRow);

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Add basic styling
  const cellStyle = {
    font: { name: "Calibri", bold: true, sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "e0e0e0" } }, // Light grey background
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
  };

  worksheet['!cols'] = Array(headers.length).fill({ wpx: 100 });

  worksheetData.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ c: colIndex, r: rowIndex });
      if (!worksheet[cellAddress]) return;

      worksheet[cellAddress].s = cellStyle;

      if (rowIndex === 0 || rowIndex === worksheetData.length - 1) {
        worksheet[cellAddress].s.fill = { fgColor: { rgb: "00B0F0" } }; // Dark blue background for headers
      }
    });
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Statement");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, "statement.xlsx");
};

export default exportExcel;
