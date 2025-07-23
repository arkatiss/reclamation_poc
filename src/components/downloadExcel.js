 export const downloadExcel = (data,fileName) => {
    if (data) {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, fileName);
    });
  }
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };

  export const exportPdf = (exportColumns, data, fileName = 'export.pdf') => {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default();

            // Format columns to extract headers and preserve the data keys (fields)
            const formattedColumns = exportColumns.map(col => ({
                header: typeof col.header === 'object' ? col.header.title : col.header,
                dataKey: col.field
            }));
            const body = data.map(row => 
                formattedColumns.map(col => row[col.dataKey])
            );
            doc.autoTable({
                head: [formattedColumns.map(col => col.header)],
                body: body
            });

            doc.save(fileName);
        });
    });
};



  export const generateCsvContent = (data, columns) => {
    const headers = columns.map(col => col.header).join(',') + '\n';
    const rows = data.map(row => {
        return columns.map(col => row[col.field]).join(',');
    }).join('\n');

    return headers + rows;
};

export const triggerCsvDownload = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export default downloadExcel
