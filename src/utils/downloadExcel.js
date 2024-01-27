export const downloadExcel = async (response) => {
  try {
    const excelBlob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(excelBlob);
    downloadLink.download = 'excel.xlsx';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Error fetching Excel file', error);
  }
};
