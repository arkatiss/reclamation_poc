import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { changeDivision } from '../../../slices/division';
import { checkIcon } from '../../../assests/icons';
/**
@remarks
Function to handle the global division state
@author Shankar Anupoju
   */
export const  DivisionComponent=()=> {
    const [options,setOptions] = useState([]);
    const userData = useSelector((state) => state?.user?.userData);
    const divisionState = useSelector((state) => state.division);
    const dispatch = useDispatch();
    const updateDivision = (e) =>{
        sessionStorage.setItem('defDivision',JSON.stringify(e.value));
        dispatch(changeDivision(e.value));
    }
    useEffect(()=>{
        if(userData?.length > 0){
        let divisionList = userData[0]?.divisionData;
        divisionList = divisionList?.map((item)=>{
            return {DIVISION:item?.DIVISION_NAME,id:item?.DIVISION_ID,SCREENDATA:item?.SCREEN_MENU}
        });
        let defaultDivision = userData[0]?.divisionData?.find((item)=>item.DIVISION_NAME === item.DEFAULT_DIVISION);
        defaultDivision = {DIVISION:defaultDivision?.DIVISION_NAME,id:defaultDivision?.DIVISION_ID,SCREENDATA:defaultDivision?.SCREEN_MENU}
        
        setOptions(divisionList);
        let defDivision =  sessionStorage.getItem('defDivision');
        if(defDivision === null){
            updateDivision({value:defaultDivision?.id ? defaultDivision :  divisionList[0]});
        }else {
            updateDivision({value:JSON.parse(defDivision)});
        }
        }
    },[userData])
    /**
    @remarks
     this function handle show icon for selecting list dropdown
    @author Raja
    */
    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span>{option.DIVISION}</span>
                {divisionState.DIVISION === option.DIVISION && (
                    <img src={checkIcon} alt='selectItem' className='ms-2' width={14} height={14}/>
                )}
            </div>
        );
    };
    return (
        <div>
            <Dropdown 
                options={options}
                optionLabel='DIVISION'
                value={divisionState}
                placeholder="Select a division" 
                className="w-full md:w-14rem" 
                 onChange={(e)=>updateDivision(e)}
                 itemTemplate={optionTemplate}
                dropdownIcon={<i className="pi pi-chevron-down" />}
            />
        </div>
    );
}

