
import React, { useState,useRef, useEffect  } from 'react'
import { useExcelDownloadMutation } from '../../../services/customersSetup';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
const TemplateComponent = (props) => {
    const [downloadFile] = useExcelDownloadMutation(); 
    const toast = useRef(null);
    const navObj = useSelector((state) => state.navigation);
    const getjobName =() =>{
      let jobName = '';
      let downloadModule = navObj.CHILD_MODULE;
      if(downloadModule === 'Customer Master'){
        jobName = 'CUSTOMER_MASTER_DWL';
     }else if(downloadModule === 'Customer Groups'){
       jobName = 'CUSTOMER_GROUP_DWL';
     }else if(downloadModule === 'Customer Profile'){
       jobName = 'CUSTOMER_PROFILE_DWL';
     }else if(downloadModule === 'Item Summary'){
       jobName = 'ITEM_DWL';
     }else if(downloadModule === 'Vendor Master'){
       jobName = 'VENDOR_MASTER_DWL';
     }else if(downloadModule === 'Vendor Profile'){
       jobName = 'VENDOR_PROFILE_DWL';
     }else if(downloadModule === 'Rules Definition'){
       jobName = 'RULES_DWL';
     }else if(downloadModule === 'Vendor Costing'){
         jobName = 'VENDOR_COSTING_DWL';
     }else if(downloadModule === 'Exploded Rules'){
         jobName = 'RULES_EXPLODED_DWL';
     }else if(downloadModule === 'Scanomatic'){
         jobName = 'SCANOMATIC_TEMPLATE_DWL';
     }else if(downloadModule === 'Scan Process'){
         jobName = 'SCAN_PROCESSING_DWL';
     }else if(downloadModule === 'Scan Error Process'){
         jobName = 'SCAN_DWL';
     }else if(downloadModule === 'Exploded Rules'){
       jobName = 'RULES_EXPLODED_DWL';
     }else if(downloadModule === 'Value Maps'){
     jobName = 'VALUE_MAP';
     }else if(downloadModule === 'Hazardous'){
       jobName = 'HAZARDOUS_TEMPLATE';
   }

      return jobName;
    }
    const getFileName =() =>{
      let fileName = '';
      let downloadModule = navObj.CHILD_MODULE;
      if(downloadModule === 'Customer Master'){
          fileName = 'customerMaster';
      }else if(downloadModule === 'Customer Groups'){
          fileName = 'CustomerGroup';
      }else if(downloadModule === 'Customer Profile'){
          fileName = 'CustomerProfile';
      }else if(downloadModule === 'Item Summary'){
          fileName = 'ItemSummary';
      }else if(downloadModule === 'Vendor Master'){
          fileName = 'VendorMaster';
      }else if(downloadModule === 'Vendor Profile'){
          fileName = 'VendorProfile';
      }else if(downloadModule === 'Scanomatic'){
          fileName = 'Scanomatic';
      }else if(downloadModule === 'Scan Error Process'){
          fileName = 'RcmScanStg';
      } else if(downloadModule === 'Scan Process'){
          fileName = 'ScanMaster';
      }
      else if(downloadModule === 'Vendor Costing'){
          fileName = 'VendorCostingRule';
      }else if(downloadModule === 'Rules Definition'){
        fileName = 'CoreProcessingRule';
      }else if(downloadModule === 'Exploded Rules'){
        fileName = 'CoreProcessRuleExp';
      }else if(downloadModule === 'Value Maps'){
      fileName = 'ValueMapDefinition';
      }else if(downloadModule === 'Hazardous'){
      fileName = 'Hazardous';
      }
      return fileName;
    }
    const [templatePayload,setTemplatePayload] = useState({ "requestMethod": "downloadFile",
        "lastUpdatedBy": "rec_test@gmail.com",
        "actionObject": {
            jobName: getjobName(),
            "templateYN": "Y",
            "fileName": getFileName(),
            "fileType": "xlsx",
            "searchParams": {
              "sortBy": "",
              "sortorder": "",
              "filterData": ""
              }
        }});
        useEffect(() => {
            downloadExcelFile();
          }, []);    

    const downloadExcelFile = async () => {   
         props?.templateLoader(true)
            try {
              let result = await downloadFile(templatePayload).unwrap();
              
              if(result?.res_status){
                toast.current.show({ severity: 'info',summary: 'Download', detail: 'Download Success', life: 3000 });
                props?.templateLoader(false);
               // props?.statusTemplate('Success', 'File requested successfully');
                props?.templateAction(false); 
              }
              else{
                props?.templateLoader(false);
                props?.statusTemplate(false);
                props?.templateAction('Fail', 'Failed');
                toast.current.show({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Download failed',
                });
              }
            } catch (e) {
                props?.templateLoader(false);
                props?.statusTemplate('Fail', 'Failed');
                props?.templateAction(false);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Download failed',
                });
            }
          };
          return(
            <>
            <Toast ref={toast} />
            </>
          )
}
export default TemplateComponent;