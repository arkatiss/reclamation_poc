import React, { useEffect, useRef, useState } from 'react';
import { dragVertical } from '../../../assests/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { useGridViewInsertMutation, useGridViewEditMutation } from '../../../services/common';
import TextField from '@mui/material/TextField';
import { clearGridView } from '../../../slices/columnSelection';
import { Toast } from 'primereact/toast';

export const ColumnGrouping = (props) => {
    const [source, setSource] = useState(props.productColumns);
    const [primaryTarget, setPrimaryTarget] = useState([]);
    const [secondaryTarget, setSecondaryTarget] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [orderName, setOrderName] = useState('');
    const navObj = useSelector((state) => state.navigation);
    const division = useSelector((state) => state.division);
    const [viewType, setViewType] = useState('2');
    const [makeDefault, setMakeDefault] = useState('N')
    const [editButton, setEditButton] = useState(false)
    const editViewRecord = useSelector((state) => state?.columnSelection?.editGridView);
    const [chips, setChips] = useState([]);
    const toastRef = useRef(null);
    useEffect(() => {
        if (props?.chips && Object?.keys(editViewRecord)?.length === 0) {
            setChips(props?.chips)
        }
    }, [props?.chips])

    let dispatch = useDispatch()
    useEffect(() => {
        if (Object?.keys(editViewRecord)?.length > 0 ) {
            setEditButton(!editButton)
            setPrimaryTarget(editViewRecord?.json_data?.primary || []);
            setSecondaryTarget(editViewRecord?.json_data?.secondary || []);
            setOrderName(editViewRecord?.FILENAME || '');
            setMakeDefault(editViewRecord?.MAKE_DEFAULT || 'N');
            setViewType(editViewRecord?.VISIBILITY || '2');
            if(editViewRecord?.selectedView === editViewRecord?.FILENAME){
                setChips(props?.chips)
            }else {
                setChips( editViewRecord?.FILTER_STRING)
            }   
        }       
    }, [editViewRecord])
    useEffect(() => {
        const filteredSource = props.productColumns.filter(
            column =>
                !primaryTarget.some(target => target.field === column.field) &&
                !secondaryTarget.some(target => target.field === column.field)
        );
        setSource(filteredSource);
    }, [primaryTarget, secondaryTarget, props.productColumns]);
    const onDragStart = (e, item) => {
        e.dataTransfer.setData('item', JSON.stringify(item));
    };
    const [insertGridView, { dataResult, isSuccess, isLoading, isFetching, error }] = useGridViewInsertMutation() 
    const [gridViewEdit, { dataResult1, isSuccess1, isLoading1, isFetching1, error1 }] = useGridViewEditMutation()
    useEffect(() => {
        if (isSuccess && dataResult) {           
            if (dataResult.status === 'Error') {               
            } else {               
                toastRef.current.show({
                    severity: 'success',
                    
                    detail: `Grouping Inserted Successfully`,
                    life: 3000 // Toast duration
                });                
            }
        }
    }, [isSuccess, dataResult]);

    const onDrop = (e, setTarget, target) => {
        const item = JSON.parse(e.dataTransfer.getData('item'));
        if (!target.some(t => t.field === item.field)) {
            setTarget([...target, item]);
            setSource(source.filter(i => i.field !== item.field));
        }
    };
    const onDragOver = (e) => {
        e.preventDefault();
    };
    const moveSelectedItems = (from, setFrom, to, setTo) => {
        const newItems = from.filter(item => !selectedItems.includes(item.field));
        const selectedObjects = from.filter(item => selectedItems.includes(item.field));
        setFrom(newItems);
        setTo([...to, ...selectedObjects]);
        setSelectedItems([]);
    };

    const handleSelect = (item) => {
        setSelectedItems(prevState =>
            prevState.includes(item.field)
                ? prevState.filter(i => i !== item.field)
                : [...prevState, item.field]
        );
    };

    const moveBackToSource = (item, target, setTarget) => {
        setSource([...source, item]);
        setTarget(target.filter(i => i.field !== item.field));
    };

    const assignColumnWidth = (cols) =>{
        const updateCols = cols?.map((item) => {
            const draggedColumn = props?.draggedColumns?.find((i) => item?.field === i?.field);
            const draggedColumnSec = props?.draggedColumnsSecondary?.find((i) => item?.field === i?.field);

            if (draggedColumn) {
                return { ...item, width: draggedColumn.width };
            }
            if (draggedColumnSec) {
                return { ...item, width: draggedColumnSec.width };
            }
            return item;
        });

        return updateCols;
    }
    const saveCols = async () => {
        const createColumns = (target) => target?.map(({ field, header,width }) => ({ field, header,width }));
        const primary = createColumns(primaryTarget);
        const secondary = createColumns(secondaryTarget);
        const columns = { primary : assignColumnWidth(primary), secondary: assignColumnWidth(secondary), closeModel: true, FILTER_STRING: props?.chips };
        const body = {
            json_data: { primary : assignColumnWidth(primary), secondary: assignColumnWidth(secondary)},
            FILENAME: orderName,
            DIVISION: division.id,
            VISIBILITY: viewType,
            MAKE_DEFAULT: makeDefault,
            FILTER_STRING: props?.chips || [],
            ...navObj,
        };
        const showToast = (severity, summary, detail) => {
            toastRef.current.show({
                severity,
                summary,
                detail,
                life: 3000,
            });
        };
        if (Object?.keys(editViewRecord)?.length === 0) {
            if (orderName) {
                let res = await insertGridView(body).unwrap();
                if(res?.status_code === 200 || res?.res_status){ 
                    showToast('success', 'Success', 'Created Successfully');
                    setTimeout(() => {
                        props.saveColumns(columns);
                    }, 2000);
                } else {
                    showToast('error', '', res?.msg);
                }      
                
                
            } else {
                showToast('error', 'Field Required', 'Grouping Name is required');
            }
        } else {
            body.ID = editViewRecord?.ID;
            let res = await gridViewEdit(body).unwrap();
            if(res?.status_code === 200 || res?.res_status){
                dispatch(clearGridView([]));
                showToast('success', 'Success', 'Updated Successfully');
            
                setTimeout(() => {
                    props.saveColumns(columns);
                }, 2000);
             } else {
                showToast('error', '', res?.msg );
             }
            
        }
    }

    const handleInputChange = (e) => {
        setOrderName(e.target.value)
    }
    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date.getTime());
    };

    return (
        <div>
        <Toast ref={toastRef} />
           <div class="columns-container">
                <div class="column">
                    <h5><span class="highlight">Available Columns</span></h5>
                    <ul className='pick-ul-columnsList column-list'>
                        {source && source.filter((item) => item?.visibility !== false && item?.primary !== true).map((item, index) => (
                            <li
                                key={index}
                                draggable
                                onDragStart={(e) => onDragStart(e, item)}
                                className={`draggable-item column-item ${selectedItems.includes(item.field) ? 'selected pick-li' : 'pick-li'}`}
                                onClick={() => handleSelect(item)}
                            >
                                <img src={dragVertical} alt='' className='me-1' />  {item.header}
                            </li>
                        ))}
                    </ul>

                </div>
                <div className="buttons">
                    <label>Primary</label>
                    <i className='pi pi-fast-forward pointer next-buttons' onClick={() => moveSelectedItems(source, setSource, primaryTarget, setPrimaryTarget)}></i>
                    <br />
                    <i className='pi pi-fast-forward pointer next-buttons' onClick={() => moveSelectedItems(source, setSource, secondaryTarget, setSecondaryTarget)}></i>
                    <label>Secondary</label>
                </div>
                <div className="column">
                    <div
                        className="section"
                        onDrop={(e) => onDrop(e, setPrimaryTarget, primaryTarget && primaryTarget)}
                        onDragOver={onDragOver}
                    >
                        <h5>Primary Columns <br /><span style={{ fontWeight: '400' }}>(Visible Columns)</span></h5>
                        <ul className='pick-ul'>
                            {primaryTarget && primaryTarget.map((item, index) => (
                                <li key={index} className="dropped-item pick-li">
                                    <span className='headerCss' title={item.header}>{item.header}</span> <i style={{ color: '#d83535' }} className='pi pi-trash pointer float-end' onClick={() => moveBackToSource(item, primaryTarget, setPrimaryTarget)}></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div
                        className="section"
                        onDrop={(e) => onDrop(e, setSecondaryTarget, secondaryTarget && secondaryTarget)}
                        onDragOver={onDragOver}
                    >
                        <h5>Secondary Columns <br /><span style={{ fontWeight: '400' }}>(Collapsed Columns)</span></h5>
                        <ul className='pick-ul'>
                            {secondaryTarget && secondaryTarget.map((item, index) => (              
                                <li key={index} className="dropped-item pick-li">
                                    <span className='headerCss' title={item.header}>{item.header}</span>  <i style={{ color: '#d83535' }} className='pi pi-trash pointer float-end' onClick={() => moveBackToSource(item, secondaryTarget, setSecondaryTarget)}></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
            <hr />
            <div>
                <h6>Query Conditions</h6>
                <div className='d-flex gap-2 flex-wrap'>
                    {chips && chips?.length > 0 ? (
                        chips.map((chip, index) => {
                            const productColumn = props?.productColumns.find(item => item.field === chip?.field);
                            return (
                                <div className='filter-card' key={index}>
                                    <span>{productColumn ? productColumn.header : chip?.field}</span>
                                    <span>{chip?.type}</span>
                                    <span title={chip?.filterValues?.map(value => value).join(', ')}>{chip?.filterValues?.map(value => value).slice(0, 1).join(', ')}{chip?.filterValues?.length > 1 ? ', ...' : ''}</span>
                                    {/* <span className='filter-value' title={chip?.userInputValue}>
                                {chip?.type === "BETWEEN" && Array.isArray(chip?.userInputValue) && chip.userInputValue.length === 2
                                    ? `${formatDate(chip.userInputValue[0])} TO ${formatDate(chip.userInputValue[1])}`
                                    : isValidDate(chip?.userInputValue)
                                    ? formatDate(chip.userInputValue)
                                    : typeof chip?.userInputValue === 'string'
                                    ? chip.userInputValue
                                    : ''}
                            </span> */}
                                    {/* <i
                                        style={{ fontSize: '12px', marginTop: '2px', color: 'rgb(211, 21, 16)' }}
                                        className="pi pi-times icon-cancel pointer"
                                        onClick={() => { props?.removeChip(index); }}
                                    ></i> */}
                                </div>
                            );
                        })
                    ) : (
                        <div className='col-sm-12 text-center'>
                            <span>No Queries Data Found</span>
                        </div>
                    )}
                </div>

            </div>
            <hr />
            <div className='d-flex gap-3'>
                <div className='col-sm-6'>
                    <div className='d-flex flex-wrap flex-column'>
                        <TextField label="Grouping Name" disabled={Object?.keys(editViewRecord)?.length === 0 ? false : true}
                            value={orderName} onChange={handleInputChange} />

                    </div></div>
                <div className='col-sm-6'>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton inputId="public" name="public" value="1"  
                            onChange={(e) => {
                                setViewType(e.value);
                                setMakeDefault('N'); 
                                }} checked={viewType === '1'} />
                            <label htmlFor="public" className="ms-2">Public Views</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="private" name="private" value="2" onChange={(e) => setViewType(e.value)} checked={viewType === '2'} />
                            <label htmlFor="private" className="ms-2">Private Views</label>
                        </div>
                    </div>
                    <div className="d-flex pt-2">
                        <Checkbox className='me-2' 
                        disabled={viewType === '1'} // Disable when Public View is selected
                        checked={makeDefault === 'Y'} onChange={(e) => setMakeDefault(e.checked ? 'Y' : 'N')} />Make Default




                    </div>
                </div>

            </div>
            <hr />
            <div className="d-flex justify-content-center gap-2 align-items-center pt-2">
                <button className='primary-button' onClick={() => saveCols()}>Save</button></div>
        </div>
    );
};


