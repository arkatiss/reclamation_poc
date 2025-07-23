import React, { useEffect, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { Toast } from 'primereact/toast';
import { useGetItemDealsMutation } from '../../../services/itemSetup';
import { useDispatch, useSelector } from 'react-redux';
import { changeSubModule } from '../../../slices/navigation';

const DealDetails=(props)=> {
  const [getDealsList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetItemDealsMutation();
  const toast = useRef(null);
  const [rowData,setRowData] = useState([]);
  const [columns,setColumns] = useState([]);
  const dispatch = useDispatch();
  /** @remarks Useeffect to get UPC data */
  useEffect(() => {
    
    let filterData = "MASTER_ITEM_ID =" + [props?.upcData?.MASTER_ITEM_ID];
    filterData = filterData.replace(/(\d+)/, "['$&']");
    fetchTobaccoData(filterData);
    dispatch(changeSubModule({subModule:'Dea'}));
  },[props?.upcData])
 /** @remarks Function to get data */
    const fetchTobaccoData = async (data) => {
      setRowData([])
      //setColumns([])
    const payLoad ={
    "requestMethod": "getHazardDea",
    "pagination": {
        "pageNumber": 0,
        "pageSize": 10
    },
    "searchParams": {
        "sortBy": "",
        "sortorder": ""
    },
    "DIVISION": 1,
    "MASTER_ITEM_ID": [
       props?.upcData?.MASTER_ITEM_ID
    ]
}
    try {
      const startTime = Date.now();
    let result = await getDealsList(payLoad).unwrap();
    const duration = (Date.now() - startTime) / 1000; // in seconds
    if(result?.status_code === 200 || result?.res_status){
      if (result?.result_set?.length === 0) {
        toast.current.show({ severity: 'info',summary: 'No Records',
          detail: `No hazardous records found (in ${duration} seconds)`,
          life: 3000 });
          
      } else {
      toast.current.show({ severity: 'info',summary: 'Fetch Successful',
        detail: `Hazardous records retrieved successfully (in ${duration} seconds)`,
        life: 3000 });
      }
        setColumns(result?.columns);
        setRowData(result?.result_set);
       
      }
     
    }  
    catch (e) { }
    };
  return (
    <div>
       <Toast ref={toast} />
      <PrimeDataTable fromVendorMaster={true} globalViews={true} columns={columns} data={rowData} 
      // crudEnabled={true} 
    //  globalViews={true}
    smartSearchOff={true}
      isLoading={isLoading} selectionMode={"multiple"}/>
    </div>
  )
}
export default DealDetails