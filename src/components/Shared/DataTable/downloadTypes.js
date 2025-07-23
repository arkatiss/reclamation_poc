import React from 'react'
import { csv, excel, pdf } from '../../../assests/icons'

const  DownloadTypes=(props)=> {


    const exportCSV = (selectionOnly) => {
   
  };

  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.save('products.pdf');
      });
    });
  };
  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
    
    });
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

  return (
    <div>
        <div className='d-flex align-items-center gap-3'>
            <div className='file-upload-wrapper'>
            <input type="file" className='file-upload-input' accept=".csv, .xlsx" onChange={props?.onFileChange} />
            <label for="file-upload" className="file-upload-label">Browse</label>
            </div>
            <div className='marginLeftAuto'>
                <img src={csv} onClick={()=>exportCSV(false)} className='downloadIcons'/>
                 <img src={excel} onClick={exportExcel} className='downloadIcons'/>
                <img src={pdf} onClick={exportPdf} className='downloadIcons'/>
            </div></div>
    </div>
  )
}

export default DownloadTypes