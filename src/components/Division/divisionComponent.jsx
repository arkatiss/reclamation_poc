import { TextField } from '@mui/material';
import { Dropdown } from 'primereact/dropdown';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PrimeDataTable from '../Shared/DataTable/DataTableComponent';
import { Button } from 'primereact/button';
import DialogBox from '../Shared/Dialog-Box/DialogBox';
import { SelectButton } from 'primereact/selectbutton';
import { useDispatch, useSelector } from 'react-redux';
import {  changeSubModule } from '../../slices/navigation';
import { useDivisionCreateMutation, useDivisionDeleteMutation, useDivisionEditMutation, useDivisionRetrievalMutation } from '../../services/user';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';

const DivivionComponent = (props) => {
    const options = ['Screen Features'];
    const [subMenu, setSubMenu] = useState('');
    const dispatch = useDispatch();
    const [divisionStatus, setDivisionStatus] = useState(null);
    const [visibleUploadPopup, setVisibleUploadPopup] = useState(false);
    const [fileName, setFileName] = useState("");
    const [updateScreenOptions, setUpdateScreenOptions] = useState('');
    const [divisionCode,setDivisionCode]= useState()
    const [divisionName,setDivisionName]= useState()
    const [defaultScreenName,setDefaultScreenName]= useState("")
    const [divisionCreate,{}]= useDivisionCreateMutation();
    const [divisionEdit,{}]= useDivisionEditMutation();
    const [divisionRetrieval,{}]= useDivisionRetrievalMutation();
    const [divisionDelete,{}]= useDivisionDeleteMutation()
    const[screenMenuName,setScreenMenuName]= useState()
    const [defaultCheck,setDefaultCheck]= useState("Y")
    const toast = useRef(null);
    const [userId,setUserId] = useState()
    const [showDeletePopup,setShowDeletePopup]= useState(false);
    const [screenMenuList,setScreenMenuList]= useState([])
    const [screenMenuPopUp,setScreenMenuPopUp]= useState(false)
    const[editableFields,setEditableFields]= useState(false)
    const [insertFields,setInsertFields]= useState()
    const divisionState = useSelector((state) => state.division);
    const[formErrors,setFormErrors]= useState({divisionCodeError: false,divisionNameError:false,divisionStatusError:false,divisionRoleError:false});
      const [updatedRoleOptions,setUpdateRoleOptions] = useState([]);
    /** @remarks Useeffect to get Division data */
    useEffect(()=>{
        divisionsRetrieval()
    },[]);

 const [rolesList,setRolesList] = useState([
        { name: 'IS Admin', key: 'IS Admin' },
        { name: 'Admin', key: 'Admin' },
        { name: 'Business User', key: 'Business User' },
        { name: 'All Read', key: 'All Read' },
    ]);
const[roleOptions,setRoleOptions]= useState([]);
    useEffect(()=>{
let options = roleOptions?.map(role => ({
    ...role,
    key: role.name
  })) || [];
  setUpdateRoleOptions(options);
    },[roleOptions])
/** @remarks Function to get Division data */
    const divisionsRetrieval = async()=>{
        let payload = {
            "preferenceData": [{
            "userName": "",
             "DIVISION_NAME":divisionState?.DIVISION
        }],
         "pagination": {
      pageNumber:0,
      pageSize:15
    }
    }
        try {
           let res = await divisionRetrieval(payload).unwrap() 
           if(res?.res_status === true){
            setTotalRecords(res?.Totalcount)
             let filteredColumns = res?.columns.filter((item)=>item?.field !== "SCREEN_MENU" && item?.field !="DIVISION_ID")
                         filteredColumns.push({ field: 'userActions', header: 'Actions' });
            setColumns(filteredColumns);
            const values = res?.insert_fields[0]?.VALUES || [];
    const formattedFields = values.map(value => ({ name: value }));
    setInsertFields(formattedFields);
            let roleData = res?.userProfiles?.map((item,index)=>{
                 return {
        ...item,
        ROLE: item?.ROLE === "" ? "- - -" : item.ROLE,
    }
            })
             setData(roleData)
           }else{
            setColumns(res?.columns ? res?.columns : [])
            setData([])
           }
        } catch (error) {           
        }
    }
    const statusDivision = [
        { name: 'Active' ,key:'Active'},
        { name: 'Inactive',key:'Inactive' },
    ];
    const handleDivisionChange = (value,name)=>{
        if (name === "divisionCode") {
            setDivisionCode(value)
        }
       else if(name === "status"){
            setDivisionStatus(value)
       } 
        else{
            setDivisionName(value)
        }
    }
    const [columns,setColumns] = useState([]);
   const [totalRecords,setTotalRecords]= useState('')
    const [pageParams,setPageParams]= useState({})
    
    const [data,setData] = useState([]);
    const [divisionFlag, setDivisionFlag] = useState("mainDivision");
    const columnsInfo = [
        { field: "screens", header: "Screens" },
        { field: "viewsWithFilters", header: "Views with filters" },
        { field: "create", header: "Create" },
        { field: "edit", header: "Edit" },
        { field: "delete", header: "Delete" },
        { field: "bulkUpdateByColumn", header: "Bulk update by column" },
        { field: "excelUpload", header: "Excel Upload" },
        { field: "excelDownload", header: "Excel Download" },
        { field: "template", header: "Template" },
        { field: "copyAndCreate", header: "Copy and create" },
        { field: "divisionStatus", header: "Status" },
    ];
    const [screenPermissions,setScreenPermissions]= useState()
     const dataInfo = [
        {
            screens: "Customer Master",
            viewsWithFilters: true,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: true,
            template: false,
            copyAndCreate: false,
            divisionStatus: true,
            //status: true
        },
        {
            screens: "Customer Profile",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: true,
            template: false,
            copyAndCreate: true,
            divisionStatus: true,
           // status: true
        },
        {
            screens: "Customer Groups",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: false,
            bulkUpdateByColumn: true,
            excelUpload: true,
            excelDownload: true,
            template: true,
            copyAndCreate: true,
            divisionStatus: true,
           // status: true
        },
        {
            screens: "Store Assignment",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: true,
            bulkUpdateByColumn: true,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
          //  status: false
        },
        {
            screens: "customerFee",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: true,
            bulkUpdateByColumn: true,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
           // status: false
        },
        {
            screens: "Item Summary",
            viewsWithFilters: true,
            create: true,
           // edit: false,
            delete: false,
            bulkUpdateByColumn: true,
            excelUpload: true,
            excelDownload: true,
            template: false,
            copyAndCreate: false,
            divisionStatus: true,
           // status: true
        },
        {
            screens: "Hazardous",
            viewsWithFilters: true,
            create: false,
            edit: true,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: true,
            template: false,
            copyAndCreate: false,
            divisionStatus: true,
          //  status: true
        },
         {
            screens: "Dispositions",
           // viewsWithFilters: true,
            //create: false,
            edit: true,
           // delete: false,
            //bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: true,
            template: false,
            //copyAndCreate: false,
            divisionStatus: true,
          //  status: true
        },
        {
            screens: "Item Details - Item Details",
            viewsWithFilters: false,
            create: false,
            edit: true,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
        },
        {
            screens: "Item Details - C&S Warehouse Details",
            viewsWithFilters: false,
            create: false,
            edit: true,
            delete: true,
            bulkUpdateByColumn: true,
            excelUpload: false,
            excelDownload: true,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
        },
        {
            screens: "Item Details - Customer Item Details",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: true,
            bulkUpdateByColumn: true,
            excelUpload: false,
            excelDownload: false,
            template: true,
            copyAndCreate: true,
            divisionStatus: false,
        },
        {
            screens: "Item Details - Mod/Shipper Details",
            viewsWithFilters: false,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
        },
        {
            screens: "Item Details - Hazardous, DEA Details",
            viewsWithFilters: false,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
        },
        {
            screens: "Item Details - Tobacco Details",
            viewsWithFilters: false,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
        },
        {
            screens: "Vendor Master",
            viewsWithFilters: true,
            create: false,
            edit: true,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: true,
            excelDownload: false,
            template: true,
            copyAndCreate: false,
            divisionStatus: true,
           // status: true
        },
        {
            screens: "Vendor Profile",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: false,
            bulkUpdateByColumn: true,
            excelUpload: false,
            excelDownload: false,
            template: true,
            copyAndCreate: true,
            divisionStatus: true,
          //  status: true
        },
        {
            screens: "System Defaults",
            viewsWithFilters: false,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: false,
         //   status: false
        },
        {
            screens: "Rules Definition",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: false,
            bulkUpdateByColumn: true,
            excelUpload: true,
            excelDownload: true,
            template: false,
            copyAndCreate: true,
            divisionStatus: true,
           // status: true
        },
        {
            screens: "Exploded Rules",
            viewsWithFilters: true,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: true,
            template: false,
            copyAndCreate: false,
            divisionStatus: true,
          //  status: true
        },
        {
            screens: "Vendor Costing",
            viewsWithFilters: false,
            create: true,
            edit: true,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: true,
            template: true,
            copyAndCreate: true,
            divisionStatus: true,
         //   status: true
        },
        {
            screens: "Scanomatic",
            viewsWithFilters: true,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: false,
            template: false,
            copyAndCreate: false,
            divisionStatus: true,
         //   status: true
        },
        {
            screens: "Scan Process",
            viewsWithFilters: true,
            create: false,
            edit: false,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: false,
            excelDownload: true,
            template: false,
            copyAndCreate: false,
            divisionStatus: true,
          //  status: true
        },
        {
            screens: "Scan Error Process",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: false,
            bulkUpdateByColumn: false,
            excelUpload: true,
            excelDownload: true,
            template: true,
            copyAndCreate: true,
            divisionStatus: true,
          //  status: true
        },
        {
            screens: "Value Maps",
            viewsWithFilters: true,
            create: true,
            edit: true,
            delete: true,
            bulkUpdateByColumn: true,
            excelUpload: false,
            excelDownload: true,
            template: false,
            copyAndCreate: true,
            divisionStatus: true,
         //   status: true
        },
        
    ];
     /** @remarks Useeffect to get Division data */
    useEffect(()=>{
        setScreenPermissions(dataInfo)
    },[])
    const updateScreenPermissions = (checked, rowData, field, index) => {
    setScreenPermissions((prevPermissions) => {
        return prevPermissions.map((permission, i) => {
            if (i === index) {
                
                return {
                    ...permission,
                    [field]: checked,                 };
            }
            return permission; 
        });
    });
};
  const getCheckBoxValueMap = (field, rowData,index) => {
      const value = rowData[field];
     const isBoolean = typeof value === 'boolean';
    return (
      <div className='d-flex justify-content-center'>
        <Checkbox 
       checked={value === true}
        disabled={!isBoolean}
        onChange={(e) =>
          isBoolean && updateScreenPermissions(e.checked, rowData, field, index)
        }
        
        />
      </div>
    );
  }
const pageChange = async(params = null) =>{
    setPageParams(params)
//   const fetchUsersList = async () => {
        let payload = {
            "preferenceData": [{
            "userName": "",
             "DIVISION_NAME":divisionState?.DIVISION
        }],
        "pagination": {
      pageNumber:params?.pageNumber,
      pageSize:params?.pageSize
    },
    searchParams: {
        sortBy: params?.sortBy,
        sortorder: params?.sortOrder,
        filterData: ""
      }
    }
        try {
           let res = await divisionRetrieval(payload).unwrap() 
           if(res?.res_status === true){
            setTotalRecords(res?.Totalcount)
             let filteredColumns = res?.columns.filter((item)=>item?.field !== "SCREEN_MENU" && item?.field !="DIVISION_ID")
                         filteredColumns.push({ field: 'userActions', header: 'Actions' });
            setColumns(filteredColumns);
            const values = res?.insert_fields[0]?.VALUES || [];
    const formattedFields = values.map(value => ({ name: value }));
    setInsertFields(formattedFields);
            let roleData = res?.userProfiles?.map((item,index)=>{
                 return {
        ...item,
        ROLE: item?.ROLE === "" ? "- - -" : item.ROLE,
    }
            })
             setData(roleData)
           }else{
            setColumns(res?.columns ? res?.columns : [])
            setData([])
           }
        } catch (error) {           
        }

  }
    const createDivision = ()=>{
     setDivisionFlag("createDivision");
      setSubMenu('Screen Features')
      setDivisionCode("")
      setDivisionName("")
      setDivisionStatus("")
      setScreenMenuName("")
      setRoleOptions(null)
    setFormErrors({divisionCodeError: false,divisionNameError:false,divisionStatusError:false,divisionRoleError:false})
    }
    const[buttonSave,setButtonSave]= useState(null)
    const editRowRecord = (field, rowData, index) => {
        setEditableFields(true)
        setScreenPermissions([])
        setFileName("")
        setDivisionCode(rowData?.DIVISION_CODE)
        setDivisionName(rowData?.DIVISION_NAME)
        setDivisionStatus(rowData?.STATUS)
         setUserId(rowData?.SEQ_ID)
         setRoleOptions(rowData?.ROLE)
         if (rowData?.SCREEN_MENU_NAME === "SYSTEM_DEFAULT") {
            setDefaultCheck("Y")
         }else{
            setDefaultCheck("N")
         }
               let roleVal = rowData?.ROLE?.split(',').map((item) => ({ name: item.trim() }));
        if (rowData?.ROLE !="- - -") {
                setRoleOptions(roleVal)
         setDivisionFlag("editDivision")
         setButtonSave(true)
        }else{
            setRoleOptions(null)
        setDivisionFlag("editDivision");
        }
          setFileName(rowData?.SCREEN_MENU_NAME);
          
      let screenMenu = [...(rowData?.SCREEN_MENU || [])];

const dispositionObj = screenMenu.find(obj => obj.screens === 'Dispositions');

if (!dispositionObj) {
  const disObj = {
    screens: "Dispositions",
    edit: false,
   // delete: false,
    excelUpload: false,
    excelDownload: false,
     template: false,
            
            divisionStatus: false,
  };

  const hazardousIndex = screenMenu.findIndex(obj => obj.screens?.toLowerCase() === 'hazardous');

  if (hazardousIndex !== -1) {
    screenMenu.splice(hazardousIndex + 1, 0, disObj);
  } 
//   else {
//     screenMenu.push(disObj);
//   }
}

// Update the original rowData object (if needed)
rowData.SCREEN_MENU = screenMenu;

        setScreenPermissions(screenMenu)
    };
    const [rowData,setRowData]= useState();
    const deleteRowRecord = (field,rowData,index)=>{
    setRowData(rowData)
    setUserId(rowData?.SEQ_ID)
    setShowDeletePopup(!showDeletePopup)
    }
     const hideDeletePopup =() =>{
          setShowDeletePopup(false);
        }
    const handleDeleteRecords = async()=>{
    const payload ={
                "preferenceData": [{
                SEQ_ID: rowData?.SEQ_ID,
                "DIVISION_NAME":rowData?.DIVISION_NAME
                }]
            } 

        try {
            let res =  await divisionDelete(payload).unwrap()
            if (res?.res_status === true || res?.res_status === false) {
                divisionsRetrieval()
            }
        } catch (error) {           
        }
        }
    const backToDivision = () => {
        setDivisionFlag('mainDivision');
        setSubMenu('Screen Features')
        setScreenPermissions(dataInfo)
        setFormErrors({divisionCodeError: false,divisionNameError:false,divisionStatusError:false,divisionRoleError:false})
        setEditableFields(false)
        setButtonSave(false)
    }
    const closeDialogBox = () => {
        setVisibleUploadPopup(false)
    }
    const SelectionDetails = () => {
        return (
            <div>
                <div className='d-grid'>
                    <label className='label'>File Name</label>
                    <TextField variant="outlined" size='small' placeholder='Enter name' className='division-dd-css' value={fileName} onChange={(event) => fileNameChange(event.target.value)}/>
                </div>
                <div className='d-flex justify-content-center pt-3'>
                    <button className='primary-button' onClick={() => saveFileName()}>Save</button>
                </div>
            </div>
        )
    }
    const hanldeShowScreen = async (name) => {
        
        const isCreate = name === "createDivision";
        if (name  === "createDivision") {
            setEditableFields(false)
        }
        else{
 const errors = {
    divisionRoleError: !roleOptions || roleOptions.length === 0,
    screenMenuNameError: !fileName
  };
  setFormErrors(errors);
   const hasErrors = Object.values(errors).some((error) => error === true);
  if (hasErrors) {
    return; 
  }
        }
        const errors = {
    divisionCodeError: !divisionCode,
    divisionNameError: !divisionName,
  };
  setFormErrors(errors);
   const hasErrors = Object.values(errors).some((error) => error === true);
  if (hasErrors) {
    return; 
  }
        const payloadData = {
          "DIVISION_CODE": divisionCode,
          "DIVISION_NAME": divisionName,
          "SCREEN_MENU": screenPermissions,
          "SEQ_ID": isCreate ? undefined : userId,
          "SCREEN_MENU_NAME": isCreate ? "SYSTEM_DEFAULT" : fileName,
          "SYSTEM_DEFAULT_FLAG": defaultCheck,
          "ROLE":roleOptions?.map((item,index)=>item?.name)
        };
        
        const apiCall = isCreate ? divisionCreate : divisionEdit;
        console.log("payloadData",payloadData)
        
        try {
          const res = await apiCall({ preferenceData: [payloadData] }).unwrap();
          if (res?.res_status) {
            divisionsRetrieval();
            setDivisionFlag('mainDivision');
            setVisibleUploadPopup(false);
            setRoleOptions(null)
            setEditableFields(false)
            toast.current.show({
                severity: 'info',
                summary: 'Success',
                detail: "Please logout and check the changes made",
            });
            setButtonSave(false)
          }
        } catch (error) {}
      };
    const changeMenu = (e) => {
        dispatch(changeSubModule({ subModule: e.value }));
        setSubMenu(e.value);
    }
    useEffect(() => {
        changeMenu({ value: 'Screen Features' });
        setUpdateScreenOptions(JSON.parse(sessionStorage.getItem("screenOptions")));
      }, []);
      const fileNameChange = (event) => {
        setFileName(event);
      };
      const handleRoleChange=(e)=>{
         setRoleOptions(e?.value)
      }
      const divisionDefaultCheck = (event)=>{
        setDefaultCheck(event?.target?.checked)
      }
      const saveFileName = async() => {
        let editPayload={ 
                "preferenceData": [{
                "DEFAULT_SCREEN_MENU": defaultScreenName,
                "STATUS": divisionStatus,
                "DIVISION_CODE": divisionCode,
                "DIVISION_ID": userId,
                "SCREEN_MENU": screenPermissions,
                "DIVISION_NAME": divisionName,
                "SCREEN_MENU_NAME":fileName,
                "SYSTEM_DEFAULT_FLAG":defaultCheck === true ? "Y" : "N",
                "ROLE":roleOptions
            }]}
            try {
                let res =  await divisionEdit(editPayload).unwrap()
                if (res?.res_status === true) {
                    divisionsRetrieval()
                    setDivisionFlag("mainDivision")
                      setVisibleUploadPopup(false);
                }
            } catch (error) {    
            }
      };
      const closeScreenMenuPopUp = ()=>{
        setScreenMenuPopUp(!screenMenuPopUp)
     setScreenMenuList([])
      }
      const updateScreenMenuList =async()=>{
         let editPayload={ 
                "preferenceData": [{
                "DEFAULT_SCREEN_MENU": defaultScreenName,
                "STATUS": divisionStatus,
                "DIVISION_CODE": divisionCode,
                "DIVISION_ID": userId,
                "SCREEN_MENU": screenPermissions,
                "DIVISION_NAME": divisionName,
                "SCREEN_MENU_NAME":fileName,
                "SYSTEM_DEFAULT_FLAG":fileName?.length>0 ? "Y" : "N",
                "ROLE":roleOptions
            }]}

             try {
                let res =  await divisionEdit(editPayload).unwrap()
                if (res?.res_status === true) {
                    divisionsRetrieval()
                    setDivisionFlag("mainDivision")
                    setVisibleUploadPopup(false);
                    setScreenMenuPopUp(false)
                }
            } catch (error) {
            }
      }

      const onSort = (params) =>{
        resetGrid();
        const sortData = {sortBy: params.sortBy,sortOrder:params.sortorder}
        pageChange(sortData)
      }
    
      const resetGrid = ()=>{
         setData([]);
         setColumns([]);
      }
const screenMenuListContent = () => {
    return (
        <div className="d-flex flex-row justify-content-between">
            <div>
                <Dropdown value={fileName} onChange={(e) => setFileName(e.value)} options={screenMenuList} optionLabel="name" 
    placeholder="Select a Screen Menu" className="w-full md:w-14rem w-100" checkmark={true}  highlightOnSelect={false} />
            </div>
            <div className="d-flex  justify-content-center">
                <button className="secondary-button me-3" onClick={closeScreenMenuPopUp}>
                    Cancel
                </button>
                <button className="success-button"  onClick={updateScreenMenuList}>
                    <i className="pi pi-user-edit me-2" />
                    Update
                </button>
            </div>
        </div>
    );
};
      const changeDefaultScreenMenu=(field,rowData,index)=>{
         setDivisionCode(rowData?.DIVISION_CODE)
        setDivisionName(rowData?.DIVISION_NAME)
        setDivisionStatus(rowData?.STATUS)
          setUserId(rowData?.SEQ_ID)
          setRoleOptions(rowData?.ROLE)
    if (rowData?.SCREEN_MENU_NAME !==null) {
        if ( rowData?.SCREEN_MENU_NAME !==null) {
              setScreenMenuList((rowData?.SCREEN_MENU_NAME).split(","))
        }else{
            setScreenMenuList([])
        }
        }else{
            setScreenMenuList([])
        }
     setScreenMenuPopUp(!screenMenuPopUp)
      }


    const rows = useMemo(() => {
      return screenPermissions?.map((row, rowIndex) => (
        <tr key={rowIndex}>
        {columnsInfo?.map((col) => (
          <td key={col.field} >
            {col.field === 'screens' ?  
            <span>{row[col?.field]}</span> 
            : getCheckBoxValueMap(col.field, row, rowIndex)
            }
          </td>
        ))}
        </tr>
      ));
    }, [screenPermissions]);

    return (
        <>
        <div className='me-3'>
            <Toast ref={toast}></Toast>
            {divisionFlag !=="createDivision" && divisionFlag !=="editDivision" &&
                        <button className='success-button'onClick={createDivision}><i className={'pi pi-file-plus me-2'} />{'Create'}</button>
                        }
                        </div>
            {divisionFlag === "mainDivision" ? (
                <div>
                    <div className='mt-3'>
                        <PrimeDataTable  columns={columns}paginator={true} hideSort pageChange={pageChange} totalRecords={totalRecords} data={data} height={33} globalViews={true} crudEnabled={true} editRowRecord={editRowRecord} 
                        deleteRowRecord={deleteRowRecord}                             pageSort={onSort} 
                        changeDefaultScreenMenu={changeDefaultScreenMenu}  selectionMode = "multiple"/>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <SelectButton className='selectiveButton' value={subMenu} onChange={(e) => changeMenu(e)} options={options} />
                        </div>
                        <div className='d-flex gap-3'>
                        {subMenu === 'Screen Features' && 
                            <button className='primary-button' onClick={()=>hanldeShowScreen(divisionFlag)}>{
    editableFields && buttonSave
      ? "Save"
      : divisionFlag !== "createDivision"
        ? "Save As"
        : "Save"
  }</button>
                        }
                            <Button onClick={backToDivision} className='border-button'>Back to Division</Button>
                        </div>
                    </div>
                    <div>
                        {visibleUploadPopup &&
                            <DialogBox header='' content={SelectionDetails()} style={{ width: '20vw' }} onHide={closeDialogBox} />
                        }
                    </div>
                    {subMenu === 'Screen Features' && 
                        <div className="mt-2 parent-container">

                            <div className='d-flex align-items-center ps-2'>
                                                <div className='me-3'>
                                                  <div style={{fontFamily:"Inter"}}>Division Code <span className='error-message'>*</span></div>
                                                    <TextField  variant="outlined" size='small' className='division-dd-css'
                                                     disabled={divisionFlag !=="createDivision" ? true : false}
                                                     placeholder='Division Code'
                                                    value={divisionCode} onChange={(e)=>handleDivisionChange(e?.target?.value,"divisionCode")}/>
                                                <p>{formErrors.divisionCodeError && <span className="error-message p-invalid autoWidth">Division code is required</span>}</p>
                        
                                                </div>
                                                <div className='me-3'>
                                                  <div style={{fontFamily:"Inter"}}>Division Name <span className='error-message'>*</span></div>
                                                    
                                                <Dropdown value={divisionName} onChange={(e)=>handleDivisionChange(e?.target?.value,"divisionName")} options={insertFields} optionLabel="name" optionValue="name"
                                                       disabled={divisionFlag !=="createDivision" ? true : false} placeholder="Status" />
                                                <p>{formErrors.divisionNameError && <span className="error-message">Division name is required</span>}</p>
                        
                                                </div>
                                                
                                                {editableFields === true &&
                                                <div className='me-3 '>
                                            <div style={{fontFamily:"Inter"}}>Screen Menu Name <span className='error-message'>*</span></div>
                                                    <TextField  variant="outlined" size='small' className='division-dd-css'
                                                    placeholder='Screen Menu Name'
                                                    // disabled={props?.divisionFlag ==="editDivision" ? true : false}
                                                    value={fileName} onChange={(e)=>fileNameChange(e?.target?.value)}/>
                                              <p>{formErrors.screenMenuNameError && <span className="error-message">Screen menu name is required</span>}</p>
                        
                                                </div>
                                                }
                                              
                                       {editableFields=== true  &&
                                          <div>
                                             <div>
                                              <div style={{fontFamily:"Inter"}}>Select Role <span className='error-message'>*</span></div>
                                              <div>
                                                <MultiSelect
                                                value={updatedRoleOptions}
                                                 options={rolesList? rolesList : []}
                                                  optionLabel="name"
                                                        placeholder="Select Role"
                                                        display="chip"
                                                onChange={(e)=>handleRoleChange(e)}
                                                />
                                          <p>{formErrors.divisionRoleError && <span className="error-message">At least one role must be selected</span>}</p>
                        
                                              </div>
                                              </div>
                                          </div>
                                        }
                                            </div>
                                           
  <table className="custom-td w-100 h-100">
                        <thead >
                            <tr>
                            {columnsInfo?.map((s) => (
                                <th key={s.field}>{s.header}</th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                           {screenPermissions?.map((row, rowIndex) => (
        <tr key={rowIndex}>
        {columnsInfo?.map((col) => (
          <td key={col.field} >
            {col.field === 'screens' ?  
            <span>{row[col?.field]}</span> 
            : getCheckBoxValueMap(col.field, row, rowIndex)
            }
          </td>
        ))}
        </tr>
      ))}
                        </tbody>
                        </table>
                                           
                      
                    </div>
                    }                    
                </div>
            )}
        <div>
                  <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup}  style={{width:"20%"}}  message="Are you sure you want to delete assignment?"
                      header="Delete Division"  accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />
        </div>
        {screenMenuPopUp &&
         <DialogBox header={"Screen Menu List"} className="divisionScreenMenuPopup" content={screenMenuListContent()} style={{ width: '30vw' }} onHide={closeScreenMenuPopUp}  />
       }
        </>
    )
}
export default DivivionComponent;