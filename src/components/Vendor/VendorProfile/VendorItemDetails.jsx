import React, { forwardRef, useEffect, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { backIcon } from '../../../assests/icons';
import { useGetItemSummaryMutation } from '../../../services/itemSetup';
import { Button } from 'primereact/button';
const VendorItemDetails = forwardRef((props, ref) => {
  const [columns,setColumns] = useState([]);
  const [data,setData] = useState([]);
    /**
    @remarks
    Function to go back to vendor master page
    @author Amar
    */  
    const handleBackToVendor = ()=>{
        props?.backButtonFunction(!props?.backButtonAction)
      }
      const [getItemSummary,{resultItemSummary,isSuccessItemSummary,isLoading,isFetchingSummary,errorSummary}]= useGetItemSummaryMutation()
       /** @remarks Useeffect to get AP vendor number through popup */
      useEffect(() => {    
           
        let filterData = "AP_VENDOR_NUM = " + [props?.apVendorNumber];
        filterData = filterData.replace(/(\d+)/, "['$&']");
    fetchItemSummaryData({
        "pagination": {
                "pageNumber": 0,
                "pageSize": 50
            },
            'CHILD_MODULE': "Item Summary",
            'PARENT_MODULE': "itemSetup",
            "requestMethod": "getItemSum",
            "orderBy": "upcItemEquals",
            "searchFormat": "json",
           "searchParams": {
                "filterData": filterData
    },
    })
    }, [props?.apVendorNumber])
 /** @remarks Function to get item data */
    const fetchItemSummaryData = async (payload) => {
        try {
          let result = await getItemSummary(payload).unwrap();
          setData(result?.result_set);
          setColumns(result?.columns)      
        } catch (e) {
        }
      };
    return(
        <>
        <div className='row'>
      <div className='col-3'>
      </div>
      <div className='col-6'></div>
      <div className='col-3'>
      <div className='d-flex gap-2 float-end'>
      <Button onClick={handleBackToVendor} className='mb-1 ms-auto primary-button'>Back to  Vendor Masters</Button>
      </div>
      </div>
    </div>
   <div className='mt-3'>
      <PrimeDataTable columns = {columns} data={data} isLoading={isLoading} smartSearchOff={true} paginator ={true} selectionMode={null}/>
      </div>
      </>
    )
})
export default VendorItemDetails