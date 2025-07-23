import { useDispatch, useSelector } from "react-redux";
import { setAddFilObj, resetAddFilObj } from "../../../../slices/filters";
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { use } from "react";

export const AdditionalFiltersComponent = (props) => {
    const navObj = useSelector((state) => state.navigation);
    const dispatch = useDispatch();

    const [moreFilterColumns, setMoreFilterColumns] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [updateAddFilObj,setUpdateAddFilObj] = useState({});
    let addFilObj = useSelector((state) => state.additionalFilters.addFilObj);

    const handleChange = (e) => {
        
        const updatedSelectedValues = e.value; 
        setSelectedValues(updatedSelectedValues); 
        const selectedField = e.selectedOption.fieldName;
        let updatedAddFilObj = {};
        if(e.value.length === 0) {
            updatedAddFilObj = {};
        }else {
            e.value.map((item) => {
                updatedAddFilObj[item.fieldName] = 'Y';
            });
        }
        // if (e.value && e.value.length > 0) {
        
        //     updatedAddFilObj[selectedField] = 'Y';
        // } else {
        //    // updatedAddFilObj[selectedField] = 'N';
        //      delete updatedAddFilObj[selectedField];
        // }
        const removedValues = selectedValues.filter(val => !updatedSelectedValues.includes(val))
        console.log('selectedValues',selectedValues);
        if (removedValues?.length > 0 ) {
         //props?.checkValue('true')
         removedValues?.map((item)=>{
            updatedAddFilObj[item?.fieldName]='N';
         })
                //  dispatch(setAddFilObj(updatedAddFilObj)); 
        }
         
        dispatch(setAddFilObj(updatedAddFilObj)); 
    };

    useEffect(() => {
      //  if(selectedValues?.length === 0){
            dispatch(resetAddFilObj());
        //}
        
    }, [dispatch]);

    useEffect(() => {
        
        if(Object.keys(updateAddFilObj).length > 0) {
        dispatch(setAddFilObj(updateAddFilObj)); 
        }

    },[updateAddFilObj])

    // useEffect(()=>{
    //     console.log('addFilObj',addFilObj);
        
    //     if(moreFilterColumns.length > 0) {
    //         debugger
    //         Object.keys(addFilObj).length > 0 && Object.keys(addFilObj).map((key)=>{
    //         debugger
    //         const filterColumn = moreFilterColumns.find(col => col.fieldName === key);
    //         if (filterColumn) {
    //             setSelectedValues(prevValues => [...prevValues, filterColumn]);
    //         }
    //     });
    //     }
       

    // },[addFilObj,moreFilterColumns])

    useEffect(() => {
        let filterCols = [];
        if (navObj.PARENT_MODULE === 'vendorSetup' && navObj.CHILD_MODULE === 'Vendor Master') {
            filterCols.push({ name: 'Inactive Vendors', fieldName: 'inactiveVendor' });
        }
        if (navObj.PARENT_MODULE === 'vendorSetup' && navObj.CHILD_MODULE === 'Vendor Profile') {
            filterCols.push({ name: 'Inactive Vendor', fieldName: 'inactiveVendor' },
                { name: 'Inactive Fees', fieldName: 'inactiveFees' },
                { name: 'System Defaults', fieldName: 'systemDefaults' },

            );
        } else if (navObj.PARENT_MODULE === 'rulesSetup' && (navObj.CHILD_MODULE === 'Rules Definition' || navObj.CHILD_MODULE === 'Exploded Rules' || navObj.CHILD_MODULE === 'Vendor Costing')) {
            filterCols = [
                  { name: 'Reclaim as Service', fieldName: 'RECLAIM_AS_SERVICE' },
                { name: 'Override Purchase Cost', fieldName: 'RULE_ENTERED_PURCH_COST' },
                { name: 'Override Sales Cost', fieldName: 'RULE_WEIGHTED_AVG_SALES_COST' },
                { name: 'Include Inactive Rules', fieldName: 'Inactive_Rules' }
            ];
            if(navObj.CHILD_MODULE === 'Rules Definition'){
             filterCols = [...filterCols, { name: 'Warehouse Damage', fieldName: 'WAREHOUSE_DAMAGE_RULE' },
                { name: 'Has Exploded', fieldName: 'RULE_UPDATEABLE' },]   
            }else if(navObj.CHILD_MODULE === 'Vendor Costing'){
              filterCols = [{
                name: 'Include Inactive Rules', fieldName: 'Inactive_Rules' 
            }]  
            }
           
        }
       
        // else if(navObj.PARENT_MODULE === 'rulesSetup' && navObj.CHILD_MODULE === 'Exploded Rules'){
        //     filterCols.push(
        //         {name: 'Swell', fieldName: 'SWELL' },
        //         {name: 'Private label', fieldName: 'PRIVATE_LABEL'} ,
        //     { name: 'Credit authorized',fieldName:'CREDIT_AUTHORIZED'}
        //     )
        // }
        setMoreFilterColumns(filterCols);
         let updatedAddFilObj = {};
         
         Object.keys(addFilObj).length > 0 && Object.keys(addFilObj).map((key)=>{
            const filterColumn = filterCols.find(col => col.fieldName === key);
            
            if (filterColumn) {
                updatedAddFilObj[key] = addFilObj[key];
                if(addFilObj[key] === 'Y'){
 setSelectedValues(prevValues => [...prevValues, filterColumn]);
                }
               
            }
             });
             setUpdateAddFilObj(updatedAddFilObj)
            // dispatch(setAddFilObj(updatedAddFilObj));

    }, [navObj]);

    if (moreFilterColumns?.length > 0) {
        return (
            <div>
                <MultiSelect
                    showSelectAll={true}
                    value={selectedValues}
                    options={moreFilterColumns}
                    onChange={(e)=>handleChange(e)}
                    placeholder="Additional Filters"
                    optionLabel="name"
                    display="chip"
                    showClear={false}
                    maxSelectedLabels={1}
                    style={{ width: '98%' }}
                />
            </div>
        );
    }

    return null;
};
