import React, { useEffect, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { Toast } from 'primereact/toast';
import { useGetModShippMutation } from '../../../services/itemSetup';

const ModShipperDetails=(props)=> {   
  const toast = useRef(null);
  const [modShippData, setModShippData] = useState([]);
  const [modShippColumns, setModShippColumns] = useState([]);
  const [getModShippList, {  dataResul, isSuccess, isLoading, isFetching, error }] = useGetModShippMutation(); 
  useEffect(() => {
    let filterData = "MASTER_ITEM_ID =" + [props?.upcData?.MASTER_ITEM_ID];
    filterData = filterData.replace(/(\d+)/, "['$&']");
    fetchModShippData(filterData);
  },[props?.upcData])
    const [modShipPayLoad,setModShipPayLoad] = useState({
      "requestMethod": "getModshipp",
      "pagination": {
          "pageNumber": 0,
          "pageSize": 15
      },
      "searchParams": {
          "sortBy": "",
          "sortorder": "",
          "filterData": ""
      },
     
      "MASTER_ITEM_ID": props?.upcData?.MASTER_ITEM_ID ? props?.upcData?.MASTER_ITEM_ID : ''
  })
  const fetchModShippData = async (data) => {
    setModShippData([])
    setModShippColumns([])
//   const payLoad ={
//     "requestMethod": "getModshipp",
//     "pagination": {
//         "pageNumber": 0,
//         "pageSize": 10
//     },
//     "searchParams": {
//         "sortBy": "",
//         "sortorder": ""
//     },
//     "MASTER_ITEM_ID": [
//            props?.upcData?.MASTER_ITEM_ID ? props?.upcData?.MASTER_ITEM_ID : ''
//       ]
// }
  try {
    const startTime = Date.now();
  let result = await getModShippList(modShipPayLoad).unwrap();
  const duration = (Date.now() - startTime) / 1000; // in seconds
  if(result?.status_code === 200 || result?.res_status){
    if (result?.result_set?.length===0) {
      toast.current.show({ severity: 'info',summary: 'No Records',
        detail: `No mod shipper records found (in ${duration} seconds)`,
        life: 3000 });
    } else {
    toast.current.show({ severity: 'info',summary: 'Fetch Successful',
      detail: `Mod shipper records retrieved successfully (in ${duration} seconds)`,
      life: 3000 });
    }
  setModShippData(result?.result_set)
  setModShippColumns(result?.columns)  
}
  } 
  catch (e) {}
  };
  const pageChange = (params) =>{
  // resetGrid();
  modShipPayLoad.pagination = params;
  setModShipPayLoad(modShipPayLoad);
  fetchModShippData(modShipPayLoad);
}
const onSort = (params) =>{
  // resetGrid();
  modShipPayLoad.searchParams.sortBy = params.sortBy;
  modShipPayLoad.searchParams.sortorder = params.sortorder;
  setModShipPayLoad(modShipPayLoad);
  fetchModShippData(modShipPayLoad);
}
  return (
    <div>
       <Toast ref={toast} />
      <PrimeDataTable globalViews={true} columns={modShippColumns} data={modShippData} isLoading={isLoading} smartSearchOff={true} pageChange={pageChange} pageSort={onSort} paginator={true}/>   
    </div>
  )
}
export default ModShipperDetails