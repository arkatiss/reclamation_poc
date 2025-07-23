import React, { useEffect, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { Toast } from 'primereact/toast';
import { useGetTobaccoDetailsMutation } from '../../../services/itemSetup';
import { useDispatch } from 'react-redux';

const TobaccoDetails=(props)=> {
  const [getTobaccoList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetTobaccoDetailsMutation();
  const toast = useRef(null);
  const [rowData,setRowData] = useState([]);
  const [columns,setColumns] = useState([]);
  const [tobaccoInfo,setTobaccoInfo] = useState({});
  /** @remarks Useeffect to get Master id through props*/
  useEffect(() => {
    let filterData = "MASTER_ITEM_ID =" + [props?.upcData?.MASTER_ITEM_ID];
    filterData = filterData.replace(/(\d+)/, "['$&']");
    fetchModShippData(filterData);
  },[props?.upcData])
  const fetchModShippData = async (data) => {
    setRowData([])
    setColumns([])
  const payLoad ={
    "requestMethod": "",
    "doPages": "",
    "pgnOffset": "",
    "pgnLimit": "",
    "orderBy": "",
    "searchFormat": "",
    "DIVISION": 1,
    "searchParams": {
        "masterItemId": [props?.upcData?.MASTER_ITEM_ID?.toString()]
      },
       pagination:{
          pageNumber:0,
          pageSize:15
          }
}
  try {
    const startTime = Date.now();
  let result = await getTobaccoList(payLoad).unwrap();
  const duration = (Date.now() - startTime) / 1000; // in seconds
  
  if(result?.status_code === 200 || result?.res_status){
    if (result?.result_set?.length===0) {
      
      toast.current.show({ severity: 'info',summary: 'No Records',
        detail: `No tobacco records found (in ${duration} seconds)`,
        life: 3000 });
         
    } else {
      toast.current.show({ severity: 'info',summary: 'Fetch Successful',
        detail: `Tobacco records retrieved successfully (in ${duration} seconds)`,
        life: 3000 });
    } 
    setRowData(result?.result_set)
    setColumns(result?.columns)
    setTobaccoInfo(result?.tobacco_fields)
}else {
  setRowData([])
  setColumns([{header:'State Code',field:'ST_CODE'},{header:'State Name',field:'ST_NAME'},{header:'State Whse Code',field:'ST_WHSE_CODE'},{header:'Tax Method',field:'TAX_METHOD'},{header:'Tax Rate',field:'TAX_RATE'}])
}

  } 
  catch (e) {
     setRowData([]);
      setColumns([{header:'State Code',field:'ST_CODE'},{header:'State Name',field:'ST_NAME'},{header:'State Whse Code',field:'ST_WHSE_CODE'},{header:'Tax Method',field:'TAX_METHOD'},{header:'Tax Rate',field:'TAX_RATE'}])
 // setColumns([])
  console.error('Error fetching customer list:', e);
  }
  };
  return (
    <div>
       <Toast ref={toast} />
       <div className='row p-2'>
        <div className='col-4'>
         <b> Tobacco Type</b><br/>
        <span>{tobaccoInfo?.tobacco_type}</span>
        </div>
         <div className='col-4'>
           <b>  Smokeless Tobacco Type</b><br/>
          <span>{tobaccoInfo?.smokeless_tobacco_type}</span>
        </div>
       </div>
      <PrimeDataTable globalViews={true} columns={columns} data={rowData} smartSearchOff={true} isLoading={isLoading} selectionMode={"multiple"}/>
    </div>
  )
}
export default TobaccoDetails