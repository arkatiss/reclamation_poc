import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { plusIcon } from '../../../assests/icons';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { InputText } from 'primereact/inputtext';
import { useProfileInsertMutation, useSearchByEmailMutation, useUsersRetrievalMutation,useProfileEditMutation, useProfileDeleteMutation, useDivisionRetrievalMutation, useSearchUsersMutation } from '../../../services/user';
import { Toast } from 'primereact/toast';
import { RadioButton } from 'primereact/radiobutton';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useSelector } from 'react-redux';
import { AutoComplete } from 'primereact/autocomplete';

const UserComponent = (props) => {
    const [formErrors, setFormErrors] = useState({});
    const [editType, setEditType] = useState(null);
    const [userPopUp,setUserPopUp] = useState(false);
    const [users,setUsers] = useState([{ user:'',role:'',division:'',defDivision:'',division_id:''}]);
    const [email,setEmail]= useState('')
    const [userName,setUserName]= useState('')
    const [searchByEmail,{}]= useSearchByEmailMutation()
    const [loader,setLoader]= useState(false)
    const [userHeaderText,setUserHeaderText]= useState("")
    const [profileInsert,{}]=useProfileInsertMutation()
    const [usersRetrieval,{}]= useUsersRetrievalMutation()
    const [profileEdit,{}]= useProfileEditMutation()
    const [profileDelete,{}]= useProfileDeleteMutation()
    const [userColumns,setUserColumns]= useState([])
    const [userData,setUserData]= useState([])
    const [totalRecords,setTotalRecords]= useState('')
    const [userId,setUserId] = useState()
    const [showDeletePopup,setShowDeletePopup]= useState(false);
    const [openDivisionPopUp,setOpenDivisionPopUp]= useState(false);
    const [divisionData,setDivisionData] = useState([]);
    const [divColumns,setDiviColumns] = useState([]);
    const [defDivision,setDefaultDivision] = useState('');
    const [divisionRetrieval,{}]= useDivisionRetrievalMutation();
    const divisionState = useSelector((state) => state.division);
    const toast = useRef(null);
    const [checkUserExists,setCheckUserExists]= useState(false)
    const [divisionList,setDivisionList] = useState([]);

    const [userEmail,setUserEmail]= useState()
      const [emailSuggestions,setEmailSuggestions]= useState([])
        const [suggestionsLoading,setSuggestionsLoading]= useState(false)


        const [searchUsers,{}]= useSearchUsersMutation()
      /** @remarks  Function to enter email */
    const handleEmailChange = async(e)=>{
        const value = e?.query;
        setEmail(value);              

             setSuggestionsLoading(true);  // Start loader

    let payload = { USER_EMAIL: e.query };

    try {
        let result = await searchUsers(payload).unwrap();
        console.log("API Response:", result);

        let suggestions = [];
        if (result?.userProfiles) {
            suggestions = result.userProfiles.map(user => user.USER_EMAIL) || [];
        }

        setEmailSuggestions(suggestions);
    } catch (error) {
        setSuggestionsLoading(false)
toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: "Error fetching in suggestions",
    });
    } finally {
        setTimeout(() => {
            setSuggestionsLoading(false);  // Stop loader with a slight delay
        }, 50);
    }
        }

         const handleEmailChangeSuggestion = (e)=>{
     
    console.log(e)
    setEmail(e.target.value)
    //  setSuggestionsLoading(true);
  }
    /** @remarks  Function to hide delete popup */
    const hideDeletePopup =(field,rowData,index) =>{    
          setShowDeletePopup(false);
        }
    /** @remarks  Function to fetch users list */
    const fetchUsersList = async (sortData = null) => {
        const payload = {
            preferenceData: {
                userName: ""
            },pagination:{
      pageNumber:0,
      pageSize:15
      },
      searchParams: {
        sortBy: sortData?.sortBy,
        sortorder: sortData?.sortOrder,
        filterData: ""
      }
        };
        try {
            let response = await usersRetrieval(payload);
            if(response?.data?.res_status){
                let userColumns = [];
                userColumns = response?.data?.columns;
                userColumns = userColumns.filter((item)=> item?.field !== 'ROLE');
                if(response?.data?.userProfiles?.length > 0){
                    userColumns = [...userColumns,{ field: 'userActions', header: 'Actions' }];
                }
                setUserColumns(userColumns);    
                setUserData(response?.data?.userProfiles);
                                setTotalRecords(response?.data.totalCount)

            }else {
                setUserData([]);
                setUserColumns(response?.data?.columns);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    // Call fetchUsersList in useEffect
    useEffect(() => {
        fetchUsersList();
        fetchDivisionList();
    }, []);
    const fetchDivisionList = async()  =>{
        let payload = {
            "preferenceData": [{
            "userName": "",
           "DIVISION_NAME":divisionState?.DIVISION
        }]}
        let res = await divisionRetrieval(payload).unwrap();
                const uniqueDivisions = [];
            const seen = new Set();
            res?.userProfiles?.forEach(division => {
                const identifier = division.DIVISION_NAME;
                if (!seen.has(identifier)) {
                    seen.add(identifier);
                    uniqueDivisions.push(division);
                }
            });
            uniqueDivisions.forEach(division => {
            });
            setDivisionList(uniqueDivisions || []);

    }
    const [rolesList,setRolesList] = useState([
        { name: 'IS Admin', key: 'IS Admin' },
        { name: 'Admin', key: 'Admin' },
        { name: 'Business User', key: 'Business User' },
        { name: 'All Read', key: 'All Read' },
    ]);

      /** @remarks  Function to add new record */

    const addNew = () =>{
       //formatObj();
        setUsers([
            ...users,
            { user:users[0].user,role:'',division:'',defDivision:'',division_id:''}
          ]);
    }
    
      /** @remarks  Function to check duplicate divisions */
    const checkDuplicateDivisions = (data) => {
        const divisionCount = {};
        for (const entry of data) {
            const division = entry.division;
            if (divisionCount[division]) {
                divisionCount[division]++;
            } else {
                divisionCount[division] = 1;
            }
        }
        for (const division in divisionCount) {
            if (divisionCount[division] > 1) {
                return true;
            }
        }
        return false;
    };
      /** @remarks  Function to click submit */
    const handleSubmit = async() => {  
    const checkDivisionAlreadyExist = checkDuplicateDivisions(users);
    if(!checkDivisionAlreadyExist){
    const divisions = users.map((item)=>{
        return {role:item.role,division:item.division,defDivision:item.defDivision,division_id:item.division_id}
    });
    let defaultDivision = divisions.find((item)=> item.defDivision === true);
    if(defaultDivision){
        let createPreferenceData = {
            USER_NAME: userName, 
            USER_EMAIL:email,
            DIVISION_ROLE_JSON: divisions,
            DEFAULT_DIVISION: defaultDivision?.division,
        }
        if(userHeaderText ==="Edit User"){
            createPreferenceData = [{...createPreferenceData, USER_ID:userId}]
        }
        let payLoad = {
            "preferenceData": createPreferenceData
        };        
        try {
             let action = userHeaderText !== "Edit User" ? "Create " : "Update";
        let apiCall = userHeaderText !== "Edit User" 
            ? profileInsert(payLoad) 
            : profileEdit(payLoad);
    
        let res = await apiCall.unwrap();
        if (res?.res_status === true) {
           
             toast.current.show({
                severity: 'info',
                summary: action,
                detail: "Please logout and check the changes made",
            });
            setUserPopUp(!userPopUp);
             setEmail("")
            fetchUsersList();
            setEmail("")
        setLoader(false)
    setCheckUserExists(false)
            }else{
       
            }            
        } catch (error) {
            console.error("Error while submitting profile:", error);
        }
    }else {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: "Please select default division",
    });
    }
    }else {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: "Can not select same division",
    });
    }   
    };
      /** @remarks  Function to store download record */
    const deleteRowRecord= (field,rowData,index)=>{
        setUserId(rowData?.USER_ID)
        setShowDeletePopup(!showDeletePopup)
    }
      /** @remarks  Function to delete records */
    const handleDeleteRecords = async()=>{
             const payload ={
                "preferenceData": [{
                USER_ID: userId
                }]
            }
       try {
        let res = await profileDelete(payload).unwrap();
        if (res?.res_status === true) {
            fetchUsersList(); 
            setShowDeletePopup(!showDeletePopup);
        }
    } catch (error) {
    }
        }
    /** @remarks  Function update records */
    const editRowRecord = (field, rowData, index) => {
        let emptyList = [{ user:'',role:'',division:'',defDivision:'',division_id:''}];
        setUsers(rowData.DIVISION_ROLE_JSON.length > 0 ? rowData.DIVISION_ROLE_JSON : emptyList)
        setEmail(rowData?.USER_EMAIL)
        setUserName(rowData?.USER_NAME)
        setUserId(rowData?.USER_ID)
        setUserPopUp(!userPopUp)
        setUserHeaderText("Edit User")
        if (rowData?.USER_NAME) {
            setCheckUserExists(true)
        }
    }
    const openUsers = () => {
        setUserName('');
        setUsers([{ user:'',role:'',division:'',defDivision:'',division_id:''}])
        // setVisible(true)
        setUserId('');
        setUserPopUp(!userPopUp);
        setUserHeaderText("Create User")
        setEmail("")
        setLoader(false)
    setCheckUserExists(false)
      };
  
    const changeContent = (value,index,field) =>{
      
        let fieldVAlue = value;
        const usersData = Array.isArray(users) ? [...users] : [];
          const updatedClause = { ...usersData[index] };
          if(field === 'division'){
            let divName = divisionList.find((item) => item.DIVISION_ID === fieldVAlue);
            updatedClause['division_id'] = divName?.DIVISION_ID;
            updatedClause[field] = divName?.DIVISION_NAME;
          }else {
            updatedClause[field] = fieldVAlue;
          }
          usersData[index] = updatedClause;
          setUsers(usersData);

    }
  /** @remarks  Function to change default division radio*/
   const handleRadioButtonChange = (index) => {
    const updatedUsers = users.map((user, i) => ({
        ...user,
        defDivision: i === index, 
    }));

    setUsers(updatedUsers);
};
  /** @remarks  Function to remove row */
    const removeRow = (idx) =>{
        const userData = users.filter((_, i) => i !== idx);
        setUsers(userData);
    }
      const userContent = () =>{
        return (
            <div className='userSettings'>
                {
                    users?.map((a, index) => {
                        return (
                            <div className='row m-0 mt-3'>
                            <div className='col-sm-11 row m-0'>
                            <div className='col-sm-3 ps-0'>
                            {index === 0 && <label className='label'>User Name<label style={{ color: 'red' }}>&nbsp;*</label></label>}
                                <InputText disabled placeholder='Name' value ={userName ? userName : a?.user}
                                className={formErrors.selectUser ? 'p-invalid w-100' : 'w-100'}/>
                        </div>
                        <div className='col-sm-3 ps-0'>
                           
                            {index === 0 &&   <label className='label'>Select Division<label style={{ color: 'red' }}>&nbsp;*</label></label>}
                            <Dropdown value={a ? a?.division_id : null} onChange={(e) => changeContent(e.value,index,'division')} options={divisionList} optionLabel="DIVISION_NAME" optionValue='DIVISION_ID'
                                placeholder="Select" className={formErrors.selectRole ? 'p-invalid w-100' : 'w-100'}
                                //  disabled={userHeaderText === "Edit User" ? true : false} 
                                 
                                 />

                           
                        </div>
                        <div className='col-sm-3 ps-0'>
                            {index === 0 &&  <label className='label'>Select Role<label style={{ color: 'red' }}>&nbsp;*</label></label>}
                           
                            <Dropdown value={a.role} onChange={(e) => changeContent(e.value,index,'role')} options={rolesList} optionLabel="name" optionValue='name'
                                placeholder="Select" className={formErrors.selectRole ? 'p-invalid w-100' : 'w-100'} 
                               />
                        </div>
                        
                        <div className='col-sm-3 ps-0'>
                            {index === 0 &&  <label className='label'>Default Division<label style={{ color: 'red' }}>&nbsp;*</label></label>}
                          {/* <div> */}
            <RadioButton
                value={true} // The value represents checked state
                checked={a.defDivision === true} // Check if `defDivision` is true
                onChange={() => handleRadioButtonChange(index)} // Call the handler with the index
                // className='d-flex justify-content-pcenter mt-2 mr-2'
                className='userRadioBtn'
                
            />
        {/* </div> */}
                    
                        </div>
                       
                            </div>
                         
                            <div className='col-sm-1 mt-auto mb-2'>
                                {
                                    index === 0 && 
                                    <div className='d-flex '>
                        {checkUserExists  &&
                          <img src={plusIcon} alt="add" className='pointer' title='Add' width={22} height={22} onClick={()=>addNew()} /> 
                          }
                          </div>
                                }
                                {
                                    index >= 1 && 
                                    <div className='d-flex ' >
                        
                                    <i className='pi pi-trash f-20 pointer'  style={{color: 'red'}} onClick={()=>removeRow(index)} ></i>
                                    </div>
                                }
                            </div>                            
                            </div>
                        )
                    })
                }
            <div className='d-flex justify-content-center mt-3'>
            <button className='secondary-button me-3' onClick={openUsers}> Cancel</button>
                <button className={checkUserExists ? 'success-button' : 'success-button disableBtn'} disabled={checkUserExists  ? false : true} onClick={handleSubmit}><i className={editType === 'userActions' ? 'pi pi-user-edit me-2' : 'pi pi-file-plus me-2'} />{userHeaderText === 'Edit User' ? 'Update' : 'Create'}</button>
            </div>                     
        </div>
        
        )
      }
        /** @remarks  Function to store Division data in grid */
      const divisionContent = () =>{
        return (
            <div>             
                <PrimeDataTable         
                columns={divColumns}
                data={divisionData}
                totalRecords={divisionData?.length > 0 ? divisionData?.length : 0}    
                smartSearchOff={true}
                height={50}
              />
            </div>
          );
      }
 
const openDivisions = (field,rowData,index)=>{
    setDivisionData(rowData.DIVISION_ROLE_JSON);
    const colData = [{field:'division',header:'Division'},{field:'role',header:'Role'}];
    setDiviColumns(colData);
    setEmail(rowData?.USER_EMAIL)
    setUserName(rowData?.USER_NAME);
    setDefaultDivision(rowData?.DEFAULT_DIVISION);
    setUserId(rowData?.USER_ID)
    setOpenDivisionPopUp(!openDivisionPopUp)
    
    
}
  /** @remarks  Function to search users */
const searchUser= async()=>{
    setLoader(true)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (emailRegex.test(email)) {
        setEmail(email);
        let payload = {
        "email":email
    }
    let res =  await searchByEmail(payload).unwrap()
     setUserName(res?.userName);
    if (res?.userName) {
    setCheckUserExists(true)
    setLoader(false)
    }else{
            setLoader(false)
    setCheckUserExists(false)

          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'User not found',
    });
    }
    } else {
        setEmail(""); 
        setLoader(false)
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: "Email format is missing",
    });
        
    }
    
}
  /** @remarks  Function to render custom header */
     const customHeader = () => {
    return (
        <div className="d-flex align-items-center flex-row justify-content-between">
            <p className="mb-0">{userHeaderText}</p>
            <div className='text-align-center'></div>
            <div className="d-flex align-items-center input-wrapper">
                {userHeaderText !== 'Edit User' &&
                <div className="position-relative">
                    <InputText placeholder="Search" style={{fontSize:'18px'}}
                     onKeyDown={(e) => {
    if (e.key === 'Enter') {
      searchUser();
    }
  }}  className="input-with-icon" value ={email} onChange={(e)=>handleEmailChange(e)} />
                    {loader === false ?
                                        <i className="pi pi-search search-icon" onClick={searchUser}></i> : ""}
                    {loader === true ? <i className="pi pi-spin pi-spinner search-icon-spinner" style={{ fontSize: '0.8rem' }}></i> : ""}
                </div>
                }
            </div>
        </div>
    );
};

  /** @remarks  Function to render customDivHeader */

const customDivHeader = () => {
    return (
        
       <div className="row m-0 align-items-center">
  <div className="col-12 col-md-4 d-flex align-items-center mb-2 mb-md-0">
    <span className="me-2" style={{ fontSize: '16px' }}>User:</span>
    <p className="mb-0" style={{ fontSize: '18px' }}>
      {userName ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase() : ''}
    </p>
  </div>
  <div className="col-12 col-md-5 d-flex align-items-center">
    <span className="me-2" style={{ fontSize: '16px' }}>Default Division:</span>
    <p className="mb-0" style={{ fontSize: '18px' }}>
      {defDivision || ''}
    </p>
  </div>
</div>
      

    );
};

const [pageParams,setPageParams]= useState({})
const pageChange = async(params) =>{
    setPageParams(params)
//   const fetchUsersList = async () => {
        const payload = {
            preferenceData: {
                userName: ""
            },"pagination": {
      pageNumber:params?.pageNumber,
      pageSize:params?.pageSize
    }
        };
        try {
            let response = await usersRetrieval(payload);
            if(response?.data?.res_status){
                 
                let userColumns = [];
                userColumns = response?.data?.columns;
                userColumns = userColumns.filter((item)=> item?.field !== 'ROLE');
                if(response?.data?.userProfiles?.length > 0){
                    userColumns = [...userColumns,{ field: 'userActions', header: 'Actions' }];
                }
                setUserColumns(userColumns);    
                setUserData(response?.data?.userProfiles);
            }else {
                setUserData([]);
                setUserColumns(response?.data?.columns);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    // };

  }
  const onSort = (params) =>{
    resetGrid();
    const sortData = {sortBy: params.sortBy,sortOrder:params.sortorder}
    fetchUsersList(sortData)
  }

  const resetGrid = ()=>{
    setUserData([]);
    setUserColumns([]);
  }

    /** @remarks  Function to close userpopup */

  const closeUserPopUp = ()=>{
    setEmail("")
    setLoader(false)
    setUserPopUp(!userPopUp)
    setCheckUserExists(false)
  }
  const handleUserSearch = async(data)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data || !emailRegex.test(data)) {
    toast.current.show({
      severity: 'warn',
      summary: 'Invalid Email',
      detail: 'Please enter valid user email',
      life: 3000
    });
    return;
  }
   const payload = {
            preferenceData: {
                userName: data
            },pagination:{
     pageNumber: 0,
pageSize: 15
      }
        };
        try {
            let response = await usersRetrieval(payload);
            if(response?.data?.res_status){
                let userColumns = [];
                userColumns = response?.data?.columns;
                userColumns = userColumns.filter((item)=> item?.field !== 'ROLE');
                if(response?.data?.userProfiles?.length > 0){
                    userColumns = [...userColumns,{ field: 'userActions', header: 'Actions' }];
                }
                setUserColumns(userColumns);    
                setUserData(response?.data?.userProfiles);
            }else {
                setUserData([]);
                // setUserColumns(response?.data?.columns);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
  }

  const clearSearch = ()=>{
    setEmail("")
    fetchUsersList()
  }
  const userStatusChange =async (e, field, rowData, index) =>{
    setUserData(prev =>
      prev.map((user, i) =>
      i === index ? { ...user, STATUS: e?.value ? 'ACTIVE' : 'IN ACTIVE' } : user
      )
    );
     let createPreferenceData =[ {
           USER_ID:rowData?.USER_ID,
           STATUS:e?.value ? 'ACTIVE' : 'IN ACTIVE',
           DIVISION_ROLE_JSON :rowData?.DIVISION_ROLE_JSON,
            USER_NAME: rowData?.USER_NAME, 
            USER_EMAIL:rowData?.USER_EMAIL,
           
            DEFAULT_DIVISION: rowData?.DEFAULT_DIVISION,
        }]
        
        let payLoad = {
            "preferenceData": createPreferenceData
        };
       
        let res = await  profileEdit(payLoad).unwrap();
         if (res?.res_status === true) {
           
             toast.current.show({
                severity: 'info',
                summary: 'Update',
                detail: "User Status Updated Successfully",
            });
          } 
  }

  const dialogBoxClose= ()=>{
    clearSearch()
  }
    return (
        <>
                  <Toast ref={toast}></Toast>

        {/* <button className='success-button d-flex justify-content-end' onClick={() => openUsers()}><i className={'pi pi-file-plus me-2'} />Create</button> */}
          <div className='d-flex flex-row justify-content-end' style={{marginLeft:"auto"}}>
          <AutoComplete placeholder="Please enter user email" value={email} suggestions={emailSuggestions} completeMethod={handleEmailChange}
             onChange={(e) => handleEmailChangeSuggestion(e)}  loading={suggestionsLoading}
             />

 <span className="p-inputgroup-addon user-icons">
            <i className="pi pi-times" onClick={()=>clearSearch(email)}></i>

              </span>
              <span className="p-inputgroup-addon user-icons">

                <i className="pi pi-search" onClick={()=>handleUserSearch(email)}></i>
              </span>
              </div>
        <div className='row m-0'>
        

            <div className='row m-0 p-0 mt-3'>
              
                <PrimeDataTable pageChange={pageChange} totalRecords={totalRecords} pageSort={onSort} paginator={true} columns={userColumns} data={userData} height={33} globalViews={true} crudEnabled={true} editRowRecord={editRowRecord} userStatusChange={userStatusChange} changeDefaultScreenMenu={openDivisions} deleteRowRecord={deleteRowRecord}/>
            </div>
        </div><>
        { userPopUp &&
         <DialogBox header={customHeader} content={userContent()} style={{ width: '55vw' }} onHide={closeUserPopUp}  />
       }                  
       {openDivisionPopUp &&
         <DialogBox header={customDivHeader} content={divisionContent()} style={{ width: '45vw' }} 
         onHide={() => {
    setOpenDivisionPopUp(false);
    console.log('Dialog closed');
    dialogBoxClose();
  }}  />
       }
    <div>
              <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} style={{width:"20%"}}  message="Are you sure you want to delete?"
                  header="Delete User"  accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />
    </div>
 
            </></>
    )
}

export default UserComponent;