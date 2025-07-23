import * as XLSX from 'xlsx';

export const handleFileUpload = async (file) => {
  if (!file) {
    return { convertedKeys: [], newDataArray: [] };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const arrayBuffer = new Uint8Array(data);
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let jsonData = [];

      if (file.name.toLowerCase().endsWith('.xlsx')) {
        jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        jsonData.shift(); // Remove header row if needed
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        const csvData = XLSX.utils.sheet_to_csv(sheet);
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map((header) => header.trim());
        jsonData = lines.slice(1).map((line) => {
          const values = line.split(',').map((value) => value.trim());
          return headers.reduce((acc, header, index) => {
            acc[header] = values[index];
            return acc;
          }, {});
        });
      }

      // Process headers and data
      const headers = Object.keys(jsonData[0] || {}).map((key) => key.toLowerCase());
      const convertedKeys = headers.map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
      }));

      const newDataArray = jsonData.map((obj) =>
        Object.keys(obj).reduce((acc, key) => {
          acc[key.toLowerCase()] = obj[key];
          return acc;
        }, {})
      );

      resolve({ convertedKeys, newDataArray });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
