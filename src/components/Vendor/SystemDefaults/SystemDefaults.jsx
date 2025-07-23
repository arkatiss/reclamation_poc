import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import { useGetSystemDefaultsMutation, useSaveSystemDefaultsMutation } from '../../../services/vendorSetup';
const SystemDefaults = (props) => {
    const [getSystemDefaults,{}] = useGetSystemDefaultsMutation()
    const [saveSystemDefaults,{}] = useSaveSystemDefaultsMutation()
    const toast = useRef(null);
    const [applyMaxCost, setApplyMaxCost] = useState(null);
    const [applyCost,setApplyCost] = useState([]);
    const [authForDebit, setAuthForDebit] = useState(null); 
    const [authDebitValue,setAuthDebitValue] = useState(null)
    const [costingMethod, setCostingMethod] = useState(null);
    const [costingMethodId, setCostingMethodId] = useState(null);
    const [defaultCostingMethod,setDefaultCostingMethod] = useState([]);
  /** @remarks Useeffect to get system defaults data */
useEffect(() => {
    const fetchSystemDefaults = async () => {
        let payload = {
            "requestMethod": "getVendSysDefault",
            "searchParams": {},
            "pagination": {
                "pageNumber": 0,
                "pageSize": 15
            },
        };
        let res = await getSystemDefaults(payload).unwrap();
      if (res) {
        let costingMethodOptions = res?.DEFAULT_COSTING_METHOD?.map(item => ({
            label: item.DEFAULT_COSTING_METHOD,
            value: item.DEFAULT_COSTING_METHOD_ID,
        }));
        setDefaultCostingMethod(costingMethodOptions);
        if (res?.vendorSystemDefaults) {
            let defaultValue = {
                label: res?.vendorSystemDefaults.DEFAULT_COSTING_METHOD,
                value: parseInt(res?.vendorSystemDefaults.DEFAULT_COSTING_METHOD_ID),
            };
            setApplyCost(res?.vendorSystemDefaults?.APPLY_MAX_COST);
            setAuthDebitValue(res?.vendorSystemDefaults?.AUTH_FOR_DEBIT);
            setCostingMethod(defaultValue?.value);
        }
            setApplyMaxCost(res?.APPLY_MAX_COST);
            setAuthForDebit(res?.AUTH_FOR_DEBIT);    
        }
    };
    fetchSystemDefaults();
}, []);

const getSysDefaults = async()=>{
    let cMethod = defaultCostingMethod.find((res)=> res.value === costingMethod);
 const payload={
    "requestMethod": "saveVendSysDefault",
    "actionObject": [
        {
            "MASTER_SEQ_ID": 41,
            "APPLY_MAX_COST": applyCost,
            "DEFAULT_COSTING_METHOD_ID": costingMethod,
            "DEFAULT_COSTING_METHOD": cMethod.label,
            "AUTH_FOR_DEBIT": authDebitValue
        }
    ],
}
        let res = await saveSystemDefaults(payload).unwrap();
        if (res?.status_code === 200 || res?.res_status) {
        toast.current.show({ severity: 'info',summary: 'save', detail: `${res?.msg}`, life: 3000 });}
        else{
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: res?.data?.msg,
              });
        }
        }
const handleChange = (e)=>{
    setCostingMethod(e?.value)
    setCostingMethodId(e?.originalEvent?.target?.innerText)
}
return(
   <>
         <span class="page-title mb-2 ms-2">Vendor Master System Defaults</span><br/>
         <hr/>
   <div className='d-flex align-items-center'>
              <Toast ref={toast} />
                        <div className='me-3 col-2'>
                            <label className='label'>Default Costing Method</label><br/>
                      <Dropdown
                    value={costingMethod}
                    onChange={(e) => handleChange(e)}
                    options={defaultCostingMethod}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Default Costing Method"
                    style={{width: '86%'}}
                />
                        </div>
                        <div className='me-3 col-1'>
                        <label className='label'>Apply Max Cost</label><br/>
                     <Dropdown
                    value={applyCost}
                    onChange={(e) => setApplyCost(e.value)}
                    options={applyMaxCost}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Apply Max Cost"
                    style={{width: '86%'}}
                />
                        </div>
                        <div className='me-3 col-1'>
                        <label className='label'>Auth For Debit</label><br/>
                            <Dropdown value={authDebitValue} onChange={(e) => setAuthDebitValue(e.value)} options={authForDebit} optionLabel="name" optionValue='name' placeholder="Auth For Debit" style={{width: '86%'}}/>
                        </div><div className='me-3 mt-3'>
                        <button className='success-button' onClick={()=>getSysDefaults()}><i className={'pi pi-file-plus me-2'}
                         />{'Save'}</button>
                        </div>
                    </div>
   </>
)
}
export default SystemDefaults