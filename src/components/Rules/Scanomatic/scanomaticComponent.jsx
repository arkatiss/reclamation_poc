import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import StatusComponent from '../../Shared/Status/Status';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useGetScanomaticListMutation } from '../../../services/customersSetup';
import { useGetScanomaticMutation } from '../../../services/rulesSetup';
import { useSelector } from 'react-redux';
import { generateFilterString } from '../../Shared/lookupPayload';
import { Toast } from 'primereact/toast';

const ScanomaticComponent = forwardRef((props,ref) => {
      const { onRowDataChange } = props;

  const [getScanomatic,{result,isSuccessScanomatic,isLoadingScanomatic,errorScanomatic}]= useGetScanomaticMutation()
  const [insertFields, setInsertFields] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterCols,setFilterCols] = useState([]);
  const toast = useRef(null);
  const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
  const [totalRecords,setTotalRecords] = useState('');
  const [scanomaticPayload,setScanomaticPayload]= useState(
{
    "requestMethod": "getScanomatic",
    "searchParams": {
        "filterData": "",
        "sortBy": "",
        "sortorder": "",
        "PRIV_LAB_FLAG":  "",
        "CREDIT_AUTHORIZED": "",
        "DEBIT_AUTHORIZED": "",
        "RECALL_FLAG": "",
        "SWELL_FLAG": "",
        "RECLAIM_AS_SERVICE": ""    
        },
    "pagination": {
        "pageNumber": 0,
        "pageSize": 15
    },
})
    /** @remarks Useeffect to get scanomatic data after upload success */  
  useEffect(() => {
    if(props?.browseKey === 'Success'){
      fetchScanomaticList(scanomaticPayload);
      props?.setKey('')
    }
  }, [props?.browseKey]);
   const resetGrid = ()=>{
    setRowData([]);
    setColumns([]);
  }
   /** @remarks Useeffect to get filtered data */
  useEffect(() => {
  if (isFilter?.filterState === true || isFilter?.filterState === false) {
    const filterString = generateFilterString(isFilter)
    const updatedCustomerPayLoad = {
      ...scanomaticPayload,
      searchParams: {
        ...scanomaticPayload.searchParams,
        filterData: filterString
      },
       pagination:{
          pageNumber:0,
          pageSize:15
          }
    };
    setScanomaticPayload(updatedCustomerPayLoad);
    //  setRowData([])
    resetGrid()
    fetchScanomaticList(updatedCustomerPayLoad);
  }
}, [isFilter]);
   /** @remarks Function to get Scanomatic data */
  const fetchScanomaticList = async (payload) => {
    try {
      let result = await getScanomatic(payload).unwrap();
      if(result?.status_code === 200 || result?.res_status){
         let filteredData=result?.result_set?.map((item,index)=>{
      if (item["RCLM_CUSTOMER_GROUP"]) {        
        return{
          ...item ,'RCLM_CUSTOMER_GROUP': `${item["RCLM_CUSTOMER_GROUP"]} - ${item["RCLM_CUSTOMER_GRP_NAME"]}`
        }
      }
      return item
    })
      setRowData(filteredData)
        if (props.onRowDataChange) {
        props.onRowDataChange(filteredData); 
      }
      setInsertFields(result?.insert_fields)
      setColumns(result?.columns)
      setFilterCols(result?.filter_cols)
      setTotalRecords(result?.total_records);
    }

    } catch (e) {}
  };
  /** @remarks Function for Pagination */
  const pageChange = (params) =>{
     setRowData([])
    scanomaticPayload.pagination.pageNumber = params.pageNumber;
    scanomaticPayload.pagination.pageSize = params.pageSize;
    fetchScanomaticList(scanomaticPayload);
  }
    /** @remarks Function for Sorting */
  const onSort = (params) =>{
     setRowData([])
    scanomaticPayload.searchParams.sortBy = params.sortBy;
    scanomaticPayload.searchParams.sortorder = params.sortorder;
    setScanomaticPayload(scanomaticPayload);
    fetchScanomaticList(scanomaticPayload);
  }
  const [data,setData] = useState([
    // {upcScanomatic: '3590028919', reclaimGroup: '16 - Tops', salesCost: '0.0', description: 'Blue LPF LR Chicken', pack:'3', size: '5', reclaimVendor: '1465',
    //   lastScan: '07/22/2024', glScanomatic: '2000', dispositionScanomatic: 'Salvage Pet', apVendor: '1465', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '4782999981', reclaimGroup: '14 - Safeway', salesCost: '0.0', description: 'Walnut Vac Can', pack:'12', size: '14', reclaimVendor: '1238',
    //   lastScan: '07/22/2024', glScanomatic: '2000', dispositionScanomatic: 'Hold Vendor Request', apVendor: '917', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '2567778886', reclaimGroup: '22-Bestmarket', salesCost: '3.2', description: '3 Cheese Mexican Shred', pack:'6', size: '7', reclaimVendor: '1456',
    //   lastScan: '07/22/2024', glScanomatic: '2100', dispositionScanomatic: 'Trash', apVendor: '1467', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '2886267189', reclaimGroup: '26-Price Chopper', salesCost: '4.5', description: 'Blue LPF LR Chicken', pack:'5', size: '6', reclaimVendor: '25617',
    //   lastScan: '07/22/2024', glScanomatic: '2100', dispositionScanomatic: 'Trash', apVendor: '1567', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '1562781998', reclaimGroup: '18-PNW', salesCost: '1.1', description: 'GRT Parm Romanochsn', pack:'10', size: '12', reclaimVendor: '2561',
    //   lastScan: '07/22/2024', glScanomatic: '2100', dispositionScanomatic: 'Salvage Pet', apVendor: '1526', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '3590028919', reclaimGroup: '16 - Tops', salesCost: '0.0', description: 'Blue LPF LR Chicken', pack:'3', size: '5', reclaimVendor: '1465',
    //   lastScan: '07/22/2024', glScanomatic: '2000', dispositionScanomatic: 'Salvage Pet', apVendor: '1465', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '4782999981', reclaimGroup: '14 - Safeway', salesCost: '0.0', description: 'Walnut Vac Can', pack:'12', size: '14', reclaimVendor: '1238',
    //   lastScan: '07/22/2024', glScanomatic: '2000', dispositionScanomatic: 'Hold Vendor Request', apVendor: '917', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '2567778886', reclaimGroup: '22-Bestmarket', salesCost: '3.2', description: '3 Cheese Mexican Shred', pack:'6', size: '7', reclaimVendor: '1456',
    //   lastScan: '07/22/2024', glScanomatic: '2100', dispositionScanomatic: 'Trash', apVendor: '1467', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '2886267189', reclaimGroup: '26-Price Chopper', salesCost: '4.5', description: 'Blue LPF LR Chicken', pack:'5', size: '6', reclaimVendor: '25617',
    //   lastScan: '07/22/2024', glScanomatic: '2100', dispositionScanomatic: 'Trash', apVendor: '1567', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '1562781998', reclaimGroup: '18-PNW', salesCost: '1.1', description: 'GRT Parm Romanochsn', pack:'10', size: '12', reclaimVendor: '2561',
    //   lastScan: '07/22/2024', glScanomatic: '2100', dispositionScanomatic: 'Salvage Pet', apVendor: '1526', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    // {upcScanomatic: '3590028919', reclaimGroup: '16 - Tops', salesCost: '0.0', description: 'Blue LPF LR Chicken', pack:'3', size: '5', reclaimVendor: '1465',
    //   lastScan: '07/22/2024', glScanomatic: '2000', dispositionScanomatic: 'Salvage Pet', apVendor: '1465', unit: '1', debitAuth: 'Y', creditAuth: 'Y', vendorDeductReason: 'RC',
    //   swellScanomatic: 'N', whiteInvoice:'', recallScanomatic: 'N', recallClassScanomatic: '', bottleDeposit: '', note: '', whseDamageFlag: '', itemType: 'CS Item', militaryUnique: 'N',
    //   privateLabelFlag: 'N', itemStatus: '', tobaccoType: '', tobaccoCredit: '', errorMessage: '', fileId: '22744', creditedBy: 'jgonzale@cswg.com'
    // },
    
    
  ])

   useImperativeHandle(ref, () => ({
        /**
        @remarks
        This function returns the columns array
        @author Shankar Anupoju
        */
        getData: () => data

    }));
    /**
    @remarks
    This function to open Rules Definition status page
    @author Amar
    */
    const openStatusComponent = ()=>{
      return(<StatusComponent showStatusTabs={props?.showStatusTabs} statusType={props?.statusType}/>) 
     }  

     /**
    @remarks
    This function to get data from parent component
    @author Sai Anil
    */
     useEffect(()=>{
      if (props?.tableData && props?.columns) {
        setData(props?.tableData);
        setColumns(props?.columns)
      }
    },[props?.tableData,props?.columns])

      useEffect(()=>{
        if (data &&columns) {
          setData(data)
          setColumns(columns)
        }
      },[data,columns])
  return (
    <div>
      <Toast ref={toast} />
      <PrimeDataTable isLoading={isLoadingScanomatic} columns={columns} data={rowData} paginator={true} height={33} insertFields={insertFields} filterCols={filterCols} totalRecords={totalRecords} pageSort={onSort} pageChange={pageChange}/>
    {props?.statusPopup &&
      <DialogBox  header={props?.statusHeader} content={openStatusComponent()} style={{width:'70vw'}} onHide={props?.onClose}/>
      }
    </div>
  )
})

export default ScanomaticComponent;