import { useEffect, useRef, useState } from 'react';
import { useGridViewRetrieveMutation, useGridViewDeleteMutation, useGridViewShareMutation } from '../../../services/common';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { PanelMenu } from 'primereact/panelmenu';
import { crudTable, plusIcon, deleteRoundIcon, editIcon, shareIcon } from '../../../assests/icons';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { MultiSelect } from 'primereact/multiselect';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';      
import {changeIsFilter, clearGridView, getEditGridView} from '../../../slices/columnSelection';
import { useGetSharedUsersForDivisionMutation } from '../../../services/user';

export const SavedColOrders = (props) => {
    const dispatch = useDispatch()
    const navObj = useSelector((state) => state.navigation);
    const division = useSelector((state) => state.division);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [delMessage, setDelMessage] = useState();
    const [deleteId, setDeleteId] = useState();
    const [selectedFilter, setSelectedFilter] = useState("Views");
    let [getSavedGridViews, { data: dataResult, isSuccess, isLoading, isFetching, error }] = useGridViewRetrieveMutation();
    const [shareGridViews, { }] = useGridViewShareMutation();
    const [deleteGridViews, { }] = useGridViewDeleteMutation();
    const [filterRecords, setFilterRecords] = useState([]);
    const [customError, setCustomError] = useState(null);
    const [visibleUploadPopup,setVisibleUploadPopup]= useState(false);
    let [resultSet,setResultSet]= useState([]);
    const userObject = useSelector(state => state?.user?.userData);
    const isFilter = useSelector((state) => state?.columnSelection?.isFilter)
    const [getSharedUsersForDivision,{}]= useGetSharedUsersForDivisionMutation()
    let selectedViewInfo = useRef('Views')
    useEffect(() => {
        if(navObj.CHILD_MODULE && navObj.PARENT_MODULE && division){
          setSelectedFilter('Views');
        } 
    }, [division,navObj.PARENT_MODULE,navObj.CHILD_MODULE]);
    useEffect(() => {
        if (props?.retOrderGrp?.includes('retrieve')) {
            
            setSelectedFilter("Views")
            fetchSavedGridViews();
        }
    }, [props?.retOrderGrp]);

    useEffect(() => {
        if (isSuccess && dataResult) {          
            if (dataResult.status === 'Error') {
                setCustomError(dataResult.message || 'An unknown error occurred');
                setFilterRecords([]);
            } else {              
                setCustomError(null);
                setResultSet(dataResult.result_set);
                setSelectedFilter('Views');               
                const views = convertToViews(dataResult.result_set || []);
                setFilterRecords(views || []);          
            }
        }
    }, [isSuccess, dataResult]);
    useEffect(() => {
        if (props?.savedViews?.res_status && props?.savedViews?.status_code === 200) {
               
                setCustomError(null);
                setResultSet(props?.savedViews?.result_set);
                setSelectedFilter('Views');               
                const views = convertToViews(props?.savedViews?.result_set || []);
                setFilterRecords(views || []);
        }
    }, [props?.savedViews]);
/**
    @remarks
    Function to show Delete view confirm dialog
    @author Amar
    */  
    const handleShowDeleteConfirm = (item) => {
        setDelMessage('Are you sure you want to delete the selected record?')
        setVisible(true);
        setDeleteId(item);
    };
/**
    @remarks
    Function to delete view
    @author Amar
    */  
    const handleDeleteView = async ()=>{
        const body = {
            ID: deleteId?.ID
        };
        try {
            await deleteGridViews(body).unwrap();
            toast.current.show({ severity: 'info',summary: 'View', detail: 'Deleted successfully', life: 3000 });
            const delDetails = resultSet?.filter(record => record.ID !== deleteId?.ID)
            setResultSet(delDetails)
            const views = convertToViews(delDetails || [], false);
            setFilterRecords(views || []);
            setVisible(false);
            if (deleteId?.FILENAME === selectedFilter) {
                props?.clearView()
                dispatch(changeIsFilter({filterState: false, filterString: null ,jsonData:null,clearChips:true}))
                setSelectedFilter("Views")
            }
        } catch (e) {
        }
    }
    const fetchSavedGridViews = async () => {
        const body = {
            PARENT_MODULE: navObj.PARENT_MODULE,
            CHILD_MODULE: navObj.CHILD_MODULE
        };

        try {
            await getSavedGridViews(body).unwrap();
        } catch (e) {
        }
    };
    const handleViewClick = (e) => {
        selectedViewInfo.current = e?.FILENAME;
        props.changeOrder(e);
        setSelectedFilter(e?.FILENAME);     
        dispatch(changeIsFilter({filterState:true,queryString:e?.FILTER_STRING,jsonData:e?.json_data}));
        
        //props.changeOrder(e);
        
    };
    const op = useRef(null);
    const convertToViews = (array, type=true) => { 
        const views = [
            { label: 'Public Views', items: [] },
            { label: 'Private Views', items: [] },
            { label: 'Shared Views', items: [] }
        ];
        array?.forEach(item => {
            const viewItem = { label: item.FILENAME, template: () => (
              <div className='d-flex p-2 pointer justify-content-between'>
              <div className='d-flex gap-2' onClick={() => handleViewClick(item)}>
              <img src={crudTable} alt="icon" width={18} className='me-2' />
                  {item.FILENAME}
              </div>
              {item.VISIBILITY === '2' &&
              <>
              <div className='d-flex gap-2' >
              <img src={editIcon} alt="icon" width={18} onClick={()=>editUsersList(item,selectedFilter)}/>
              <img src={shareIcon} alt="icon" width={18} onClick={()=>handleShare(item)}/>
              <img src={deleteRoundIcon} alt="icon" width={18} onClick={() => handleShowDeleteConfirm(item)}/>
              </div>
              </>
              
                  }
              </div>
          ),dataObj:item };

            if (item.VISIBILITY === '1') {
                views[0].items.push(viewItem);
            } else if(item.VISIBILITY === '2'){
                views[1].items.push(viewItem);
            }else if(item?.VISIBILITY === '3'){
                views[2].items.push(viewItem);
            }
        });
        views?.forEach(view => {
          view?.items.sort((a, b) => {
              const itemA = array.find(item => item?.FILENAME === a?.label);
              const itemB = array.find(item => item?.FILENAME === b?.label);
              if (itemA && itemB) {
                  if (itemA?.MAKE_DEFAULT === 'Y' && itemB?.MAKE_DEFAULT === 'N') return -1;
                  if (itemA?.MAKE_DEFAULT === 'N' && itemB?.MAKE_DEFAULT === 'Y') return 1;
              }
              return a?.label?.localeCompare(b.label);
          });
      });
      
      
      views?.forEach(view => {
          if (view?.items?.length === 0) {
              view?.items?.push({ label: 'No Records Found' });
          }
      });
      
      const isGroupColumnsEmpty = !props?.filterApplied || Object.keys(props.filterApplied || {}).length === 0;
      if (type !== false && isGroupColumnsEmpty) {
        // const defaultViews = views?.flatMap(group => 
        //     group?.items.filter(item => item?.dataObj?.MAKE_DEFAULT === "Y")
        // );
        const defaultViews = views[1]?.items?.filter(item => item?.dataObj?.MAKE_DEFAULT === "Y");
        const jsonObj = defaultViews[0]?.dataObj;
        if (jsonObj) {
          
            if (!props?.retOrderGrp?.includes('retrieve') || jsonObj.FILENAME !== selectedFilter) {
                handleViewClick(jsonObj);
            }else{
                setSelectedFilter(selectedFilter);
            }
        } else if (!props?.retOrderGrp?.includes('retrieve') || selectedFilter === 'Views') { 
            props?.clearView();
            
            if(array.length > 0){
                
                dispatch(changeIsFilter({ filterState: false,queryString:selectedFilter === 'Views' ? null : isFilter?.filterString }));
            }           
        }else {
            setSelectedFilter(selectedFilter)
        }
    }  
    
    if(props?.applySavedView && Object.keys(props?.applySavedView).length > 0){
        
        handleViewClick(props?.applySavedView);
        // setSelectedFilter(props?.applySavedView?.FILENAME ?? 'Views');
    }
        return views;
    };
    const editUsersList = (item,name) => {
        const newData = {...item,selectedView: selectedViewInfo?.current}
        props.openColumnsGrouping()
        dispatch(getEditGridView(newData))   
    }
    const divisionState = useSelector((state) => state.division);
    const [newUsersList,setNewUsersList]= useState()
    const handleShare = async(item) => {  
        setVisibleUploadPopup(true);
        setItemInfo(item);
        let payload={
            "DIVISION":divisionState?.id
        }
        let res = await getSharedUsersForDivision(payload);
        if (res?.data?.userProfiles) {
        setNewUsersList(res?.data?.userProfiles);    
        }
       }
     const handleSubmitShare = () =>{
        handleShareView();
        setSelectUsers(null)
        fetchSavedGridViews()
     }  
     /**
    @remarks
    Function to share view
    @author Amar
    */  
    const handleShareView = async ()=>{
        const body = {       
           SHARED_USERS: selectUsers
        };
        Object?.assign(body, itemInfo);
        body.VISIBILITY = '3';
        body.MAKE_DEFAULT= 'N'
        
        try {
            let res = await shareGridViews(body).unwrap();
            if(res?.res_status && res?.status_code === 200){
                toast.current.show({ severity: 'info',summary: 'View', detail: 'Shared successfully', life: 3000 }); 
                setVisibleUploadPopup(false);  
            }  
            else{
                toast.current.show({ severity: 'error',summary: 'View', detail: 'Shared Fail', life: 3000 });
            }       
        } catch (e) {
        }
    }
    const closeDialogUpload = ()=>{
        setVisibleUploadPopup(false)
        setSelectUsers(null);

      }
    const [selectUsers, setSelectUsers] = useState(null);
    const [itemInfo, setItemInfo] = useState();
    let usersList = [
        { name: 'sanupoju@cswg.com', code: 'sa' },
        { name: 'areddyga@cswg.com', code: 'ar' },
        { name: 'aravanam@cswg.com', code: 'ra' },
        { name: 'kmantrip@cswg.com', code: 'km' },
        { name: 'sanapart@cswg.com', code: 'saa' },
        {name:'sbulusu@cswg.com',code:'sb'},
        {name:'rardani@cswg.com',code:'ra'}
    ];
    usersList = usersList?.filter(res => res.name !==userObject[0]?.email)
    const shareOptions = () => {
        return (
            <div className="col-sm-12 d-grid">
            <label>Users</label>
            <MultiSelect value={selectUsers} onChange={(e) => setSelectUsers(e.value)} options={newUsersList} optionLabel="USER_EMAIL" 
    optionValue="USER_EMAIL"
                placeholder="Select" maxSelectedLabels={2} className="w-100" />
                <div className='d-flex mt-3 gap-2 justify-content-center'>
                <button className='secondary-button' onClick={closeDialogUpload}>Cancel</button>
                <button className='primary-button' onClick={handleSubmitShare}>Submit</button>       
                </div> 
        </div>         
        );
      };
    useEffect(()=>{
        if (props?.clearViewRecord === true) {
            setSelectedFilter("Views");

            const views = [...filterRecords]
            setFilterRecords(views || []);
        }
    },[props?.clearViewRecord])
const handleClearInfo = () =>{
    selectedViewInfo.current = 'Views';
    props?.clearView();
}
    return (
        <div>
             <Toast ref={toast} />
            <Button
                className='views-list'
                // label={selectedFilter}
                label={(
        <>
            {props?.clearViewRecord === true ? "Views" : <span className="text-ellipsis">{selectedFilter}</span>}
            
            {
                selectedFilter !== 'Views' && <i className={props?.clearViewRecord === true ? " " : "pi pi-times icon-cancel pointer"} style={{ fontSize: '12px', marginTop: '2px', paddingLeft:'5px' }} onClick={()=>handleClearInfo()}></i>
                
            }
            
             {/* Extra icon */}
        </>
    )}
                icon="pi pi-chevron-down"
                iconPos="right"
                onClick={(e) => op.current.toggle(e)}
                title={selectedFilter}
            />

            <OverlayPanel className='views' ref={op} style={{ width: '300px' }}>
            
                <PanelMenu model={filterRecords} className='list-menu' />
               

                <div className="p-d-flex text-center p-2" style={{ borderTop: '1px solid #D6D6D6' }}>
                    <button
                        className='create-view-button'
                        onClick={() => { props.openColumnsGrouping();dispatch(clearGridView([])) }}
                    >
                        <span>Create View</span>
                        <img src={plusIcon} alt="icon" width={18} className='ms-2' />
                    </button>
                </div>
            </OverlayPanel>

            {visibleUploadPopup &&
    
                <DialogBox header='Share' content={shareOptions()} style={{width:'25vw'}} onHide={closeDialogUpload}/>
                  }
                   <ConfirmDialog  visible={visible} onHide={() => setVisible(false)} message={delMessage}
                header="Delete View" icon="pi pi-info-circle"  accept={handleDeleteView}/>
        </div>
    );
};
